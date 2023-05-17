export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  try {

    const name = extractNameFromInput(url);
    const jsonUrl = `https://forecast.predictwind.com/vodafone/${name}.json`;

    console.log('downloading ', + jsonUrl);
    const response = await fetch(jsonUrl);
    const data = await response.json();

    // Perform server-side processing to convert data to GPX
    const gpxData = convertToGPX(data);

    res.setHeader('Content-Disposition', 'attachment; filename=data.gpx');
    res.setHeader('Content-Type', 'application/gpx+xml');
    res.status(200).send(gpxData);
  } catch (error) {
    console.error('Error fetching JSON:', error);
    res.status(500).json({ error: 'Error fetching JSON' });
  }
}

const extractNameFromInput = (input) => {
  // Extract the name from the input URL or alphanumeric word
  let name = input.split('/').filter(part => part !== '').pop(); // Extract the last non-empty part of the URL after the last '/'
  name = name.replace('.json', ''); // Remove the '.json' extension if present
  return name;
};

function convertToGPX(data) {
  let gpx = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<gpx xmlns="http://www.topografix.com/GPX/1/1" version="1.1" creator="Your Application">
  <metadata>
    <name>Your GPX Track</name>
  </metadata>
  <trk>
    <name>Track 1</name>
    <trkseg>
`;

  data.route.forEach((point) => {
    const lat = point.p.lat;
    const lon = point.p.lon;
    const time = new Date(point.t * 1000).toISOString();

    gpx += `      <trkpt lat="${lat}" lon="${lon}">
        <time>${time}</time>
      </trkpt>
`;
  });

  gpx += `    </trkseg>
  </trk>
</gpx>`;

  return gpx;
}
