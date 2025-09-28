import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';
import { userQuestService } from '@/services/userQuestService';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ questId: string }> }
) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { questId } = await context.params;
    const quest = await userQuestService.getUserQuest(questId, user.id);

    if (!quest) {
      return NextResponse.json({ error: 'Quest not found' }, { status: 404 });
    }

    return NextResponse.json({ quest });
  } catch (error) {
    console.error('Error fetching quest:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ questId: string }> }
) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { progress } = await request.json();

    if (typeof progress !== 'number' || progress < 0) {
      return NextResponse.json(
        { error: 'Invalid progress value' }, 
        { status: 400 }
      );
    }

    const { questId } = await context.params;
    const result = await userQuestService.updateQuestProgress(
      questId, 
      user.id, 
      progress
    );

    if (!result.quest) {
      return NextResponse.json(
        { error: 'Failed to update quest' }, 
        { status: 500 }
      );
    }

    return NextResponse.json({
      quest: result.quest,
      expGained: result.expGained
    });
  } catch (error) {
    console.error('Error updating quest:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ questId: string }> }
) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { questId } = await context.params;
    const success = await userQuestService.deleteQuest(questId, user.id);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete quest' }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting quest:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}