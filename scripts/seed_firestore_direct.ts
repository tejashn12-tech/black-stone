import { initializeApp } from 'firebase/app';
import { initializeFirestore, doc, collection, getDocs, writeBatch } from 'firebase/firestore';
import config from '../firebase-applet-config.json';
import { PARSED_IMPORTED_MEMBERS } from '../src/data/importedMembers';
import { PARSED_IMPORTED_PAYMENTS } from '../src/data/importedPayments';
import { INITIAL_PACKAGES } from '../src/data/initialData';

async function seedFirestoreDirect() {
  console.log('Connecting to Firestore database:', config.firestoreDatabaseId);
  const app = initializeApp(config);
  const db = initializeFirestore(app, {}, config.firestoreDatabaseId);

  // 1. Purge old members
  console.log('Purging existing members in Firestore...');
  const memberSnap = await getDocs(collection(db, 'members'));
  if (!memberSnap.empty) {
    const docs = memberSnap.docs;
    for (let i = 0; i < docs.length; i += 300) {
      const chunk = docs.slice(i, i + 300);
      const batch = writeBatch(db);
      chunk.forEach(d => batch.delete(d.ref));
      await batch.commit();
    }
    console.log(`Purged ${docs.length} old members.`);
  }

  // 2. Purge old payments
  console.log('Purging existing payments in Firestore...');
  const paySnap = await getDocs(collection(db, 'payments'));
  if (!paySnap.empty) {
    const docs = paySnap.docs;
    for (let i = 0; i < docs.length; i += 300) {
      const chunk = docs.slice(i, i + 300);
      const batch = writeBatch(db);
      chunk.forEach(d => batch.delete(d.ref));
      await batch.commit();
    }
    console.log(`Purged ${docs.length} old payments.`);
  }

  // 3. Purge existing packages in Firestore
  console.log('Purging existing packages in Firestore...');
  const pkgSnap = await getDocs(collection(db, 'packages'));
  if (!pkgSnap.empty) {
    const pkgBatchDelete = writeBatch(db);
    pkgSnap.docs.forEach(d => pkgBatchDelete.delete(d.ref));
    await pkgBatchDelete.commit();
    console.log(`Purged ${pkgSnap.size} old packages.`);
  }

  // 4. Batch insert packages
  console.log(`Writing ${INITIAL_PACKAGES.length} packages...`);
  const pkgBatch = writeBatch(db);
  INITIAL_PACKAGES.forEach(pkg => {
    pkgBatch.set(doc(db, 'packages', pkg.id), pkg);
  });
  await pkgBatch.commit();
  console.log('Packages written.');

  // 4. Batch insert 317 members
  console.log(`Writing ${PARSED_IMPORTED_MEMBERS.length} members...`);
  for (let i = 0; i < PARSED_IMPORTED_MEMBERS.length; i += 300) {
    const chunk = PARSED_IMPORTED_MEMBERS.slice(i, i + 300);
    const batch = writeBatch(db);
    chunk.forEach(m => {
      batch.set(doc(db, 'members', m.id), m);
    });
    await batch.commit();
    console.log(`Committed members chunk ${i + 1} to ${i + chunk.length}`);
  }

  // 5. Batch insert payments
  console.log(`Writing ${PARSED_IMPORTED_PAYMENTS.length} payments...`);
  for (let i = 0; i < PARSED_IMPORTED_PAYMENTS.length; i += 300) {
    const chunk = PARSED_IMPORTED_PAYMENTS.slice(i, i + 300);
    const batch = writeBatch(db);
    chunk.forEach(p => {
      batch.set(doc(db, 'payments', p.id), p);
    });
    await batch.commit();
    console.log(`Committed payments chunk ${i + 1} to ${i + chunk.length}`);
  }

  // 6. Verify counts
  const finalMemberSnap = await getDocs(collection(db, 'members'));
  const finalPaySnap = await getDocs(collection(db, 'payments'));
  console.log('Final Firestore verification:');
  console.log('Members in Firestore:', finalMemberSnap.size);
  console.log('Payments in Firestore:', finalPaySnap.size);

  process.exit(0);
}

seedFirestoreDirect().catch(err => {
  console.error('Direct seeding failed:', err);
  process.exit(1);
});
