// Enhanced video summary generation
export interface VideoSummaryOptions {
  maxLength?: number;
  includeTimestamp?: boolean;
  includeCategory?: boolean;
  includeKeyPoints?: boolean;
}

export function generateVideoSummary(
  title: string,
  description: string,
  category?: string,
  duration?: string,
  options: VideoSummaryOptions = {}
): string {
  const {
    maxLength = 300,
    includeTimestamp = false,
    includeCategory = true,
    includeKeyPoints = true
  } = options;

  // Clean and process the description
  const processedDescription = cleanDescription(description);
  
  // Extract key points if enabled
  const keyPoints = includeKeyPoints ? extractKeyPoints(processedDescription) : [];
  
  // Build the summary
  let summary = '';
  
  // Add category context if available
  if (includeCategory && category && category !== 'General') {
    summary += `[${category}] `;
  }
  
  // Add timestamp if enabled and duration available
  if (includeTimestamp && duration) {
    summary += `(${duration}) `;
  }
  
  // Add the main description
  summary += processedDescription;
  
  // Add key points if extracted
  if (keyPoints.length > 0) {
    summary += '\n\nKey Points:\n';
    keyPoints.forEach((point) => {
      summary += `• ${point}\n`;
    });
  }
  
  // Truncate if too long
  if (summary.length > maxLength) {
    summary = summary.substring(0, maxLength - 3) + '...';
  }
  
  return summary;
}

function cleanDescription(description: string): string {
  // Remove common YouTube description clutter
  let cleaned = description
    .replace(/Subscribe to.*?channel.*?/gi, '') // Remove subscribe prompts
    .replace(/Like.*?comment.*?share.*?/gi, '') // Remove engagement prompts
    .replace(/Follow us on.*?/gi, '') // Remove social media prompts
    .replace(/Visit our website.*?/gi, '') // Remove website prompts
    .replace(/For more.*?videos.*?/gi, '') // Remove related content prompts
    .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double
    .replace(/^\s+|\s+$/g, '') // Trim whitespace
    .replace(/\s+/g, ' '); // Replace multiple spaces with single space
  
  // Remove timestamps (e.g., "0:15 Introduction")
  cleaned = cleaned.replace(/\d+:\d+\s+[A-Za-z\s]+/g, '');
  
  // Remove hashtags
  cleaned = cleaned.replace(/#\w+/g, '');
  
  // Remove URLs
  cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, '');
  
  return cleaned;
}

function extractKeyPoints(description: string): string[] {
  const keyPoints: string[] = [];
  
  // Look for bullet points or numbered lists
  const bulletMatches = description.match(/[•\-\*]\s*([^\n]+)/g);
  if (bulletMatches) {
    bulletMatches.forEach(match => {
      const point = match.replace(/[•\-\*]\s*/, '').trim();
      if (point.length > 10 && point.length < 100) {
        keyPoints.push(point);
      }
    });
  }
  
  // Look for numbered lists
  const numberedMatches = description.match(/\d+\.\s*([^\n]+)/g);
  if (numberedMatches) {
    numberedMatches.forEach(match => {
      const point = match.replace(/\d+\.\s*/, '').trim();
      if (point.length > 10 && point.length < 100) {
        keyPoints.push(point);
      }
    });
  }
  
  // If no structured points found, try to extract sentences that look like key points
  if (keyPoints.length === 0) {
    const sentences = description.split(/[.!?]+/);
    sentences.forEach(sentence => {
      const trimmed = sentence.trim();
      if (trimmed.length > 20 && trimmed.length < 150) {
        // Look for sentences that start with action words or contain important keywords
        if (
          /^(Learn|Discover|Explore|Understand|Find out|Get|Know|See|Watch)/i.test(trimmed) ||
          /(important|key|essential|crucial|vital|significant)/i.test(trimmed)
        ) {
          keyPoints.push(trimmed);
        }
      }
    });
  }
  
  // Limit to 3-5 key points
  return keyPoints.slice(0, 5);
}

// Enhanced excerpt generation for different contexts
export function generateBlogExcerpt(
  title: string,
  description: string,
  category?: string,
  duration?: string
): string {
  return generateVideoSummary(title, description, category, duration, {
    maxLength: 200,
    includeCategory: true,
    includeKeyPoints: false
  });
}

export function generateHomeExcerpt(
  title: string,
  description: string,
  category?: string,
  duration?: string
): string {
  return generateVideoSummary(title, description, category, duration, {
    maxLength: 150,
    includeCategory: false,
    includeKeyPoints: false
  });
}

export function generateFullSummary(
  title: string,
  description: string,
  category?: string,
  duration?: string
): string {
  return generateVideoSummary(title, description, category, duration, {
    maxLength: 500,
    includeCategory: true,
    includeTimestamp: true,
    includeKeyPoints: true
  });
}
