import axios from 'axios';
import { JSDOM } from 'jsdom';

interface Link {
  url: string;
}

interface ObjectData {
  links: Link[];
}

interface Specification {
  key: string;
  value: string;
}

interface GuitarData {
  product_name: string;
  image_url: string;
  price: string;
  description: string;
  specifications: Specification[];
}

async function importObject(obj: ObjectData): Promise<void> {
  const { links } = obj;

  for (const link of links) {
    await scrapeLink(link.url);
  }
}

async function scrapeLink(link: string): Promise<void> {
  const response = await axios.get(link);
  const html = response.data;
  const { document } = new JSDOM(html).window;

  const data = extractData(document);
  processData(data);
}

function extractData(document: Document): GuitarData {
  const data: GuitarData = {} as GuitarData;

  // Find the product name.
  const productElement = document.querySelector('h1.product-name');
  if (productElement) {
    data.product_name = productElement.textContent || '';
  }

  // Find the image tag that contains the guitar image.
  const imageElement = document.querySelector('img.product-image');
  if (imageElement) {
    data.image_url = imageElement.getAttribute('src') || '';
  }

  // Download the image.
  // ...

  // Get the price.
  const priceElement = document.querySelector('span.price');
  if (priceElement) {
    data.price = priceElement.textContent || '';
  }

  // Get the description.
  const descriptionElement = document.querySelector('div.product-description');
  if (descriptionElement) {
    data.description = descriptionElement.textContent || '';
  }

  // Get the specifications.
  const specifications: Specification[] = [];
  const specificationElements = document.querySelectorAll('table.specs tr');
  specificationElements.forEach((specificationElement) => {
    const keyElement = specificationElement.querySelector('td.key');
    const valueElement = specificationElement.querySelector('td.value');
    if (keyElement && valueElement) {
      const key = keyElement.textContent || '';
      const value = valueElement.textContent || '';
      specifications.push({ key, value });
    }
  });
  data.specifications = specifications;

  return data;
}

function processData(data: GuitarData): void {
  console.log(data);
}

const obj: ObjectData = {
  links: [
    {
      url: 'https://www.bajaao.com/products/jackson-js32-king-v-electric-guitar?variant=41691680243891',
    },
    {
      url: 'https://www.bajaao.com/products/fender-player-series-stratocaster-electric-guitar?variant=41691680243891',
    },
    {
      url: 'https://www.bajaao.com/products/yamaha-pacifica-012-v2-electric-guitar?variant=41691680243891',
    },
  ],
};

importObject(obj);
s