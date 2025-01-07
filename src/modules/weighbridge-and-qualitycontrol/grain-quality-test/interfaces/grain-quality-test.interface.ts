export interface IGrainQualityTest {
    id: string;
    lotId?: string;
    moistureContent: number;
    brokenGrainsPercentage: number;
    foreignMatterPercentage: number;
    notes?: string;
    testDate: Date;
    createdAt: Date;
  }
  