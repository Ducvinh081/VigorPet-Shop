import { isAdmin } from "@/libs/authOptions";
import { MenuItem } from "@/models/MenuItem";
import connectDB from "@/libs/mongoConnect";

export async function POST(req) {
    await connectDB();
  const data = await req.json();

  if (data.category === "") {
    delete data.category;
  }

  if (await isAdmin()) {
    try {
      const menuItemDoc = await MenuItem.create(data);
      return new Response(JSON.stringify(menuItemDoc), { status: 201, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
  } else {
    return new Response(JSON.stringify({ error: "Not authorized" }), { status: 403, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function PUT(req) {
  await connectDB();
  if (await isAdmin()) {
    const { _id, ...data } = await req.json();
    await MenuItem.findByIdAndUpdate(_id, data);
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
  return new Response(JSON.stringify({ error: "Not authorized" }), { status: 403, headers: { 'Content-Type': 'application/json' } });
}

export async function GET() {
  await connectDB();
  const menuItems = await MenuItem.find();
  return new Response(JSON.stringify(menuItems), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export async function DELETE(req) {
  await connectDB();
  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');

  if (await isAdmin()) {
    await MenuItem.deleteOne({ _id });
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  return new Response(JSON.stringify({ error: "Not authorized" }), { status: 403, headers: { 'Content-Type': 'application/json' } });
}
