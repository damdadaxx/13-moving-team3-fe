// zod - 견적 관련 유효성 검사 스키마
import { z } from 'zod';

export const estimateRequestSchema = z.object({});

export type EstimateRequestSchema = z.infer<typeof estimateRequestSchema>;
