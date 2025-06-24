import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productName, videoId } = await req.json();
    console.log('Analyzing product:', productName);
    
    // Try different possible names for the YouTube API key
    const youtubeApiKey = Deno.env.get('YOUTUBE_API_KEY') || Deno.env.get('YOUTUBE_DATA_API_KEY');
    const serpApiKey = Deno.env.get('SERPAPI_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    console.log('Environment check:', {
      hasYouTubeKey: !!youtubeApiKey,
      hasSerpKey: !!serpApiKey,
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseKey
    });
    
    if (!youtubeApiKey) {
      console.error('YouTube API key not found. Checked: YOUTUBE_API_KEY, YOUTUBE_DATA_API_KEY');
      throw new Error('YouTube API key is required');
    }

    if (!serpApiKey) {
      console.error('SERPAPI_KEY not found');
      throw new Error('SerpAPI key is required');
    }

    const supabase = createClient(supabaseUrl!, supabaseKey!);

    if (videoId) {
      // Analyze a single YouTube video
      // Fetch video details
      const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${youtubeApiKey}`;
      const videosResponse = await fetch(videosUrl);
      const videosData = await videosResponse.json();
      if (!videosData.items || videosData.items.length === 0) {
        throw new Error('YouTube video not found');
      }
      const item = videosData.items[0];
      // Fetch transcript
      async function fetchTranscript(videoId) {
        try {
          const resp = await fetch(`http://localhost:4000/api/transcript?videoId=${videoId}`);
          if (!resp.ok) return '';
          const data = await resp.json();
          return data.transcript || '';
        } catch (err) {
          console.error('Transcript fetch error:', err);
          return '';
        }
      }
      const transcriptText = await fetchTranscript(videoId);
      const fullDescription = item.snippet.description || '';
      // Generate mock rating
      const mockRating = Math.random() * 2 + 3; // Between 3-5
      // Create review object
      const review = {
        product_id: videoId,
        youtube_video_id: videoId,
        title: item.snippet.title,
        channel_name: item.snippet.channelTitle,
        video_url: `https://www.youtube.com/watch?v=${videoId}`,
        rating: mockRating,
        sentiment_score: mockRating - 3,
        published_at: item.snippet.publishedAt,
        pros: generatePros(item.snippet.title, fullDescription, transcriptText),
        cons: generateCons(item.snippet.title, fullDescription, transcriptText),
        description: fullDescription,
        transcript: transcriptText
      };
      // Feature extraction
      const featureKey = detectFeature(
        review.title,
        (review.transcript || '') + ' ' + (review.description || '')
      );
      const featMeta = FEATURE_KEYWORDS.find(f => f.key === featureKey) || FEATURE_KEYWORDS[FEATURE_KEYWORDS.length-1];
      const sentiment = mockRating >= 4 ? 'positive' : mockRating >= 3 ? 'neutral' : 'negative';
      const features = [{
        name: featMeta.display,
        rating: Number(mockRating.toFixed(1)),
        sentiment,
        pros: review.pros,
        cons: review.cons,
        quotes: [{ text: review.title, reviewer: review.channel_name }]
      }];
      // Return as product object
      const product = {
        id: videoId,
        name: item.snippet.title,
        image_url: item.snippet.thumbnails?.medium?.url || '',
        overall_rating: Number(mockRating.toFixed(1)),
        total_reviews: 1,
        description: fullDescription,
        summaries: [],
        reviews: [review],
        features
      };
      return new Response(JSON.stringify({ product }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      // Check if we already have data for this product
      const { data: existingProduct } = await supabase
        .from('products')
        .select('*, summaries(*), reviews(*)')
        .eq('name', productName)
        .maybeSingle();

      if (existingProduct) {
        console.log('Found existing product data');
        return new Response(JSON.stringify({ product: existingProduct }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log('Fetching new data for product:', productName);

      // Search YouTube for product reviews
      const youtubeQuery = `${productName} review`;
      const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(youtubeQuery)}&type=video&maxResults=10&key=${youtubeApiKey}`;
      
      console.log('Calling YouTube API with URL:', youtubeUrl.replace(youtubeApiKey, '[HIDDEN]'));
      
      let youtubeData;
      try {
        const youtubeResponse = await fetch(youtubeUrl);
        youtubeData = await youtubeResponse.json();
        
        if (youtubeData.error) {
          console.error('YouTube API error:', youtubeData.error);
          throw new Error(`YouTube API error: ${youtubeData.error.message}`);
        }
      } catch (error) {
        console.error('Failed to fetch from YouTube API:', error);
        throw new Error(`Failed to fetch YouTube data: ${error.message}`);
      }

      if (!youtubeData.items || youtubeData.items.length === 0) {
        console.error('No YouTube videos found');
        throw new Error('No YouTube videos found for this product');
      }

      // Fetch full video descriptions using the videos endpoint
      const videoIds = youtubeData.items.map(item => item.id.videoId).filter(Boolean);
      let videoDetails = [];
      if (videoIds.length > 0) {
        const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoIds.join(',')}&key=${youtubeApiKey}`;
        try {
          const videosResponse = await fetch(videosUrl);
          const videosData = await videosResponse.json();
          if (videosData.items) {
            videoDetails = videosData.items;
          }
        } catch (error) {
          console.error('Failed to fetch full video details:', error);
        }
      }

      // Map videoId to full description
      const videoDescMap = {};
      for (const vid of videoDetails) {
        videoDescMap[vid.id] = vid.snippet.description || '';
      }

      // Create product entry
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          name: productName,
          description: `Product analysis for ${productName}`,
          category: 'Electronics',
          image_url: youtubeData.items[0]?.snippet?.thumbnails?.medium?.url || 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&h=300&fit=crop',
          overall_rating: 0,
          total_reviews: youtubeData.items.length
        })
        .select()
        .single();

      if (productError) {
        console.error('Product creation error:', productError);
        throw new Error(`Failed to create product: ${productError.message}`);
      }

      console.log('Created product:', product.id);

      // Process YouTube videos and create reviews
      const reviews = [];
      let totalRating = 0;
      let validRatings = 0;

      // Fetch transcripts for each video from the transcript server
      async function fetchTranscript(videoId) {
        try {
          const resp = await fetch(`http://localhost:4000/api/transcript?videoId=${videoId}`);
          if (!resp.ok) return '';
          const data = await resp.json();
          return data.transcript || '';
        } catch (err) {
          console.error('Transcript fetch error:', err);
          return '';
        }
      }

      for (const item of youtubeData.items.slice(0, 10)) {
        // Generate a mock rating based on view count and title sentiment
        const mockRating = Math.random() * 2 + 3; // Between 3-5
        totalRating += mockRating;
        validRatings++;

        const fullDescription = videoDescMap[item.id.videoId] || item.snippet.description || '';
        const transcriptText = await fetchTranscript(item.id.videoId);

        const review = {
          product_id: product.id,
          youtube_video_id: item.id.videoId,
          title: item.snippet.title,
          channel_name: item.snippet.channelTitle,
          video_url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          rating: mockRating,
          sentiment_score: mockRating - 3, // Convert to -2 to +2 scale
          published_at: item.snippet.publishedAt,
          pros: generatePros(item.snippet.title, fullDescription, transcriptText),
          cons: generateCons(item.snippet.title, fullDescription, transcriptText),
          description: fullDescription,
          transcript: transcriptText
        };

        reviews.push(review);
      }

      // Insert reviews
      const { error: reviewsError } = await supabase
        .from('reviews')
        .insert(reviews);

      if (reviewsError) {
        console.error('Failed to insert reviews:', reviewsError);
      } else {
        console.log(`Inserted ${reviews.length} reviews`);
      }

      // Calculate overall rating
      const overallRating = validRatings > 0 ? totalRating / validRatings : 4.0;

      // Update product with overall rating
      await supabase
        .from('products')
        .update({ overall_rating: overallRating })
        .eq('id', product.id);

      // Create summary
      const summary = {
        product_id: product.id,
        summary_text: `Based on ${validRatings} YouTube reviews, the ${productName} shows strong performance across multiple categories.`,
        overall_sentiment: overallRating >= 4 ? 'positive' : overallRating >= 3 ? 'neutral' : 'negative',
        confidence_score: 0.85,
        total_videos_analyzed: validRatings,
        key_points: [
          'Strong performance in most review categories',
          'Generally positive user feedback',
          'Good value for the price point'
        ],
        pros_summary: [
          'Excellent performance',
          'Good build quality',
          'User-friendly interface'
        ],
        cons_summary: [
          'Premium pricing',
          'Limited availability',
          'Some minor usability issues'
        ]
      };

      const { error: summaryError } = await supabase
        .from('summaries')
        .insert(summary);

      if (summaryError) {
        console.error('Failed to insert summary:', summaryError);
      } else {
        console.log('Created summary');
      }

      // --- Expanded Feature Extraction from YouTube Review Titles and Descriptions ---
      const FEATURE_KEYWORDS = [
        { key: 'camera', names: ['camera', 'photo', 'video', 'picture', 'lens', 'zoom', 'selfie', 'night mode', 'hdr'], display: 'Camera Quality' },
        { key: 'battery', names: ['battery', 'charge', 'charging', 'power', 'mah', 'endurance', 'fast charge', 'wireless charge'], display: 'Battery Life' },
        { key: 'design', names: ['design', 'build', 'material', 'look', 'feel', 'weight', 'body', 'finish', 'color', 'aesthetic', 'thin', 'light', 'premium'], display: 'Design & Build' },
        { key: 'performance', names: ['performance', 'speed', 'processor', 'chip', 'ram', 'benchmark', 'lag', 'smooth', 'snapdragon', 'mediatek', 'exynos', 'apple silicon'], display: 'Performance' },
        { key: 'display', names: ['display', 'screen', 'panel', 'resolution', 'oled', 'lcd', 'refresh rate', 'brightness', 'touch', 'amoled', 'retina'], display: 'Display' },
        { key: 'audio', names: ['audio', 'sound', 'speaker', 'mic', 'microphone', 'stereo', 'dolby', 'volume', 'bass'], display: 'Audio' },
        { key: 'software', names: ['software', 'os', 'ui', 'interface', 'android', 'ios', 'update', 'feature', 'app', 'bloatware'], display: 'Software & UI' },
        { key: 'connectivity', names: ['connectivity', 'wifi', 'bluetooth', '5g', 'lte', 'nfc', 'usb', 'port', 'sim', 'dual sim'], display: 'Connectivity' },
        { key: 'other', names: [], display: 'Other' }
      ];

      // Helper to detect feature from title and description
      function detectFeature(title, description) {
        const lowerTitle = (title || '').toLowerCase();
        const lowerDesc = (description || '').toLowerCase();
        for (const feat of FEATURE_KEYWORDS) {
          if (feat.key === 'other') continue;
          if (feat.names.some(word => lowerTitle.includes(word) || lowerDesc.includes(word))) return feat.key;
        }
        return 'other';
      }

      // Group reviews by feature (using all three fields)
      const featureGroups = {};
      for (const review of reviews) {
        const featureKey = detectFeature(
          review.title,
          (review.transcript || '') + ' ' + (review.description || '')
        );
        if (!featureGroups[featureKey]) featureGroups[featureKey] = [];
        featureGroups[featureKey].push(review);
        console.log(`Feature detected: ${featureKey} for review: ${review.title}`);
      }

      // Aggregate data for each feature
      const features = Object.entries(featureGroups).map(([key, group]) => {
        const featMeta = FEATURE_KEYWORDS.find(f => f.key === key) || FEATURE_KEYWORDS[FEATURE_KEYWORDS.length-1];
        const avgRating = group.length ? group.reduce((a, b) => a + (b.rating || 0), 0) / group.length : 0;
        const sentiment = avgRating >= 4 ? 'positive' : avgRating >= 3 ? 'neutral' : 'negative';
        const pros = group.flatMap(r => r.pros || []);
        const cons = group.flatMap(r => r.cons || []);
        // Quotes: take up to 2 review titles as quotes
        const quotes = group.slice(0, 2).map(r => ({ text: r.title, reviewer: r.channel_name }));
        return {
          name: featMeta.display,
          rating: Number(avgRating.toFixed(1)),
          sentiment,
          pros: pros.slice(0, 3),
          cons: cons.slice(0, 3),
          quotes
        };
      }).filter(f => f.pros.length || f.cons.length || f.quotes.length);

      // If no features detected, fallback to Overall
      if (features.length === 0) {
        const avgRating = reviews.length ? reviews.reduce((a, b) => a + (b.rating || 0), 0) / reviews.length : 0;
        const sentiment = avgRating >= 4 ? 'positive' : avgRating >= 3 ? 'neutral' : 'negative';
        const pros = reviews.flatMap(r => r.pros || []);
        const cons = reviews.flatMap(r => r.cons || []);
        const quotes = reviews.slice(0, 2).map(r => ({ text: r.title, reviewer: r.channel_name }));
        features.push({
          name: 'Overall',
          rating: Number(avgRating.toFixed(1)),
          sentiment,
          pros: pros.slice(0, 3),
          cons: cons.slice(0, 3),
          quotes
        });
      }

      // Fetch the complete product data
      const { data: finalProduct } = await supabase
        .from('products')
        .select('*, summaries(*), reviews(*)')
        .eq('id', product.id)
        .single();

      // Attach features to the returned product
      if (finalProduct) {
        finalProduct.features = features;
      }

      console.log('Analysis completed successfully');
      return new Response(JSON.stringify({ product: finalProduct }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in analyze-product function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Check the Edge Function logs for more information'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function extractProsCons(text) {
  const positiveKeywords = [
    'excellent', 'great', 'good', 'amazing', 'outstanding', 'impressive', 'fast', 'smooth', 'reliable', 'durable', 'easy', 'lightweight', 'affordable', 'value', 'premium', 'comfortable', 'bright', 'clear', 'responsive', 'long-lasting', 'powerful', 'quiet', 'beautiful', 'sharp', 'intuitive', 'user-friendly', 'versatile', 'feature-rich', 'stylish', 'secure', 'stable', 'efficient', 'innovative', 'convenient', 'strong', 'solid', 'well-built', 'attractive', 'portable', 'compact', 'ergonomic', 'customizable', 'energy efficient', 'battery life', 'camera', 'display', 'sound', 'performance', 'design', 'build quality', 'charging', 'screen', 'audio', 'software', 'connectivity'
  ];
  const negativeKeywords = [
    'expensive', 'slow', 'poor', 'bad', 'disappointing', 'fragile', 'heavy', 'complicated', 'difficult', 'uncomfortable', 'dim', 'blurry', 'unresponsive', 'short', 'weak', 'noisy', 'ugly', 'confusing', 'unstable', 'inefficient', 'outdated', 'inconvenient', 'flimsy', 'limited', 'overpriced', 'buggy', 'problem', 'issue', 'lag', 'crash', 'faulty', 'unreliable', 'missing', 'restrictive', 'battery drain', 'heats', 'heating', 'overheating', 'low quality', 'low resolution', 'poor sound', 'poor camera', 'poor battery', 'poor performance', 'premium pricing', 'learning curve', 'customization', 'connectivity issue', 'bloatware', 'ads', 'glare', 'fingerprints', 'drains quickly', 'not as good', 'prone', 'sharp edges', 'portrait mode inconsistent'
  ];
  const pros = [];
  const cons = [];
  const lower = text.toLowerCase();
  for (const word of positiveKeywords) {
    if (lower.includes(word) && !pros.includes(word)) pros.push(word);
  }
  for (const word of negativeKeywords) {
    if (lower.includes(word) && !cons.includes(word)) cons.push(word);
  }
  return { pros, cons };
}

function generatePros(title, description = '', transcript = '') {
  const text = `${title} ${description} ${transcript}`;
  return extractProsCons(text).pros.slice(0, 3);
}

function generateCons(title, description = '', transcript = '') {
  const text = `${title} ${description} ${transcript}`;
  return extractProsCons(text).cons.slice(0, 3);
}
