export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("q");

  if (!address) {
    return Response.json({ error: "Missing query" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    const data = await res.json();

    if (!data.results || !data.results.length) {
      return Response.json({ error: "Location not found" }, { status: 404 });
    }

    const location = data.results[0].geometry.location;

    return Response.json({
      lat: location.lat,
      lng: location.lng,
    });
  } catch (err) {
    return Response.json(
      { error: "Failed to fetch location" },
      { status: 500 }
    );
  }
}