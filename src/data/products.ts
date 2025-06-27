export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  link: string;
  category?: string;
  rating?: string;
  sales?: string;
  originalPrice?: string;
}

export const products: Product[] = [
  {
    id: 'product-1',
    name: 'Bone Broth',
    description: 'Premium, nutrient-rich broth designed to support optimal gut health, digestion, and overall wellness. Packed with collagen, amino acids, and essential minerals.',
    imageUrl: '/images/products/BoneBroth.png',
    price: '$6.00',
    originalPrice: '$7.00',
    link: 'https://example.com/bone-broth',
    category: 'Nutrition',
    rating: '4.4/5 ⭐',
    sales: '927 units'
  },
  {
    id: 'product-2',
    name: 'Hydration Powder',
    description: 'Science-backed electrolyte blend designed to optimize hydration while supporting gut health. Contains essential electrolytes, prebiotics, and gut-friendly minerals.',
    imageUrl: '/images/products/HydrationPowder.png',
    price: '$6.00',
    originalPrice: '$7.00',
    link: 'https://example.com/hydration-powder',
    category: 'Wellness',
    rating: '4.2/5 ⭐',
    sales: '124 units'
  },
  {
    id: 'product-3',
    name: 'Probiotics',
    description: 'Clinically formulated to restore balance, enhance digestion, and strengthen immunity. Contains multi-strain probiotics and prebiotic fibers.',
    imageUrl: '/images/products/Probiotics.png',
    price: '$6.00',
    originalPrice: '$7.00',
    link: 'https://example.com/probiotics',
    category: 'Health',
    rating: '4.1/5 ⭐',
    sales: '829 units'
  },
  {
    id: 'product-4',
    name: 'Recovery Coffee',
    description: 'Premium, gut-friendly coffee blend designed to energize your body while supporting digestion and microbiome balance. Infused with prebiotics, digestive enzymes, and adaptogens.',
    imageUrl: '/images/products/RecoveryCoffee.png',
    price: '$3.00',
    originalPrice: '$4.00',
    link: 'https://example.com/recovery-coffee',
    category: 'Beverages',
    rating: '4.5/5 ⭐',
    sales: '1,179 units'
  },
  {
    id: 'product-5',
    name: 'ZoCam-O1',
    description: 'First-of-its-kind at-home optical imaging capsule for detailed, physician-reviewed gut health insights. Powered by advanced optical imaging and cloud-based AI analysis.',
    imageUrl: '/images/products/ZoCam-01.png',
    price: '$399.00',
    originalPrice: '$400.00',
    link: 'https://example.com/zocam-o1',
    category: 'Diagnostics',
    rating: '4.8/5 ⭐',
    sales: '2,203 units'
  },
  {
    id: 'product-6',
    name: 'ZoCam-O2',
    description: 'Next evolution in at-home gut health diagnostics, combining optical imaging and microbiome sampling. Provides complete picture of gut health with AI-enhanced processing.',
    imageUrl: '/images/products/ZoCam-02.png',
    price: '$399.00',
    originalPrice: '$400.00',
    link: 'https://example.com/zocam-o2',
    category: 'Diagnostics',
    rating: '4.6/5 ⭐',
    sales: '1,022 units'
  },
  {
    id: 'product-7',
    name: 'ZoCam-A1',
    description: 'Next generation non-invasive colorectal cancer (CRC) screening device using acoustic imaging technology. Level-1 screening device with radiation-free, patient-friendly approach.',
    imageUrl: '/images/products/ZoCam-A1.png',
    price: '$799.00',
    originalPrice: '$800.00',
    link: 'https://example.com/zocam-a1',
    category: 'Diagnostics',
    rating: '4.4/5 ⭐',
    sales: '799 units'
  },
  {
    id: 'product-8',
    name: 'Microbiome Testing Kit',
    description: 'Science-backed, precision-driven analysis of gut microbiome with personalized insights and actionable recommendations. Uses advanced sequencing technology.',
    imageUrl: '/images/products/MicrobiomeTestingKit.png',
    price: '$29.00',
    originalPrice: '$30.00',
    link: 'https://example.com/microbiome-testing-kit',
    category: 'Testing',
    rating: '4.6/5 ⭐',
    sales: '322 units'
  }
]; 