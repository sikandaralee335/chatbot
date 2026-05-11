export enum SynthesisCategory {
  VISUAL_BLUEPRINT = 'VISUAL_BLUEPRINT',
  THE_PROMPT = 'THE_PROMPT',
  TEXTUAL_SYNTHESIS = 'TEXTUAL_SYNTHESIS'
}

export interface SynthesisResponse {
  blueprint: {
    subject: string;
    composition: string;
    style: string;
    atmosphere: string;
  };
  prompt: string;
  synthesis: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  synthesis?: SynthesisResponse;
  timestamp: number;
}
