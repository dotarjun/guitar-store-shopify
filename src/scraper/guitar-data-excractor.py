import requests
from bs4 import BeautifulSoup

# q: does this file have errors?
# a: no



def importObject(obj) :
  # Get the links from the object.
  links = obj.links

  # Loop through the links and scrape them.
  for link in links :
    # Scrape the link.
    scrapeLink(link)

def scrapeLink(link) :
  # Make a GET request to the link.
  response = requests.get(link)

  # Parse the HTML using Beautiful Soup.
  soup = BeautifulSoup(response.content, 'html.parser')

  # Extract the data from the link.
  data = extractData(soup)

  # Do something with the data.
  processData(data)

def extractData(soup) :
  # Extract the data from the link.
  data = {}

  # Find the product name.
  product_name = soup.find('h1', class_='product-name').text

  # Find the image tag that contains the guitar image.
  image_tag = soup.find('img', class_='product-image')

  # Get the URL of the image.
  image_url = image_tag['src']

  # Download the image.
  image_data = requests.get(image_url).content

  # Save the image.
  with open(product_name + '.jpg', 'wb') as f:
    f.write(image_data)

  # Get the price.
  price = soup.find('span', class_='price').text

  # Get the description.
  description = soup.find('div', class_='product-description').text

  # Get the specifications.
  specifications = soup.find('table', class_='specs').find_all('tr')

  # Add the specifications to the data object.
  for specification in specifications :
    key = specification.find("td", class_="key").text
    value = specification.find("td", class_="value").text
    data[key] = value

  return data

def processData(data) :
  # Do something with the data.
  print(data)

if __name__ == '__main__' :
  # Import the object.
  obj = {
    'links' : [
      {
        'url' : 'https://www.bajaao.com/products/jackson-js32-king-v-electric-guitar?variant=41691680243891'
      },
      {
        'url' : 'https://www.bajaao.com/products/fender-player-series-stratocaster-electric-guitar?variant=41691680243891'
      },
      {
        'url' : 'https://www.bajaao.com/products/yamaha-pacifica-012-v2-electric-guitar?variant=41691680243891'
      }
    ]
  }

  # Import the object.
  importObject(obj)
