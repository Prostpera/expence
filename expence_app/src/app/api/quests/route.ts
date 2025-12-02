import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';
import { userQuestService } from '@/services/userQuestService';

async function ensureUserExists(supabase: any, user: any) {
  const { data: userRecord, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .single();

  if (userError && userError.code === 'PGRST116') {
    // User doesn't exist, create them
    await supabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email!,
        username: user.email!.split('@')[0],
        display_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email!.split('@')[0],
        level: 1,
        total_exp: 0,
        current_exp: 0,
        exp_to_next_level: 100,
        rank: 'Newbie',
        age_verified: false
      });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureUserExists(supabase, user);

    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    const quests = await userQuestService.getUserQuests(
      user.id, 
      status as any
    );
    return NextResponse.json({ quests });
  } catch (error) {
    console.error('Error fetching quests:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await ensureUserExists(supabase, user);

    const questData = await request.json();

    if (!questData.title || !questData.description || !questData.category || !questData.difficulty) {
      return NextResponse.json(
        { error: 'Missing required quest fields' }, 
        { status: 400 }
      );
    }

    const quest = await userQuestService.createUserQuest(user.id, questData);

    if (!quest) {
      return NextResponse.json(
        { error: 'Failed to create quest' }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ quest }, { status: 201 });
  } catch (error) {
    console.error('Error creating quest:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}