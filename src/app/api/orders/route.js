import {authOptions, isAdmin} from "@/libs/authOptions";
import {Order} from "@/models/Order";
import connectDB from "@/libs/mongoConnect";
import {getServerSession} from "next-auth";

export async function GET(req) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  const admin = await isAdmin();

  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');
  if (_id) {
    return Response.json( await Order.findById(_id) );
  }


  if (admin) {
    return Response.json( await Order.find() );
  }

  if (userEmail) {
    return Response.json( await Order.find({userEmail}) );
  }

}

export async function DELETE(req) {
  await connectDB();
  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');
  if (await isAdmin()) {
    await Order.deleteOne({_id});
  }
  return Response.json(true);
}