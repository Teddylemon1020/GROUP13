import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/utils/mongodb';
import User from '@/models/usermodel';
import { authOptions } from '@/lib/auth';

// GET all users with full details for debugging
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Fetch ALL fields to see what's in the database
    const users = await User.find({}).lean();

    return NextResponse.json({ 
      count: users.length,
      users: users,
      message: "This shows all user data in your database"
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', details: String(error) },
      { status: 500 }
    );
  }
}
