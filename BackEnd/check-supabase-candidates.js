import 'dotenv/config';
import { initPostgres, closePool } from './config/postgres.js';
import { AISourcedCandidate } from './models/postgres/aiSourcedCandidate.model.js';

const checkCandidates = async () => {
  try {
    initPostgres();
    
    console.log('📊 Checking AI-sourced candidates in Supabase...\n');
    
    const [total, stats, recent] = await Promise.all([
      AISourcedCandidate.countAll(),
      AISourcedCandidate.getStatsBySourceType(),
      AISourcedCandidate.getAll(5, 0)
    ]);

    console.log(`✅ Total AI-sourced candidates: ${total}\n`);
    
    if (stats.length > 0) {
      console.log('📈 Breakdown by source:');
      stats.forEach(s => console.log(`   ${s.ai_source_type}: ${s.count}`));
      console.log();
    }

    if (recent.length > 0) {
      console.log('👥 Recent candidates:');
      recent.forEach((c, i) => {
        console.log(`   ${i + 1}. ${c.full_name} - ${c.email || c.phone || 'No contact'}`);
        console.log(`      Skills: ${c.skills?.slice(0, 3).join(', ') || 'None'}`);
        console.log(`      Source: ${c.ai_source_type}`);
        console.log();
      });
    } else {
      console.log('⏳ No candidates yet. Wait 30 seconds and run again.\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await closePool();
    process.exit(0);
  }
};

checkCandidates();
