import { RatingDisplay } from '@/components/rating';

describe('RatingDisplay', () => {
  it('returns a renderable element', () => {
    const element = RatingDisplay({ value: 3 });
    expect(element).toBeTruthy();
  });
});
