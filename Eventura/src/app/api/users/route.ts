import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/utils/mongodb';
import User from '@/models/usermodel';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET all users
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const users = await User.find({}, { _id: 1, name: 1, email: 1, image: 1 })
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
