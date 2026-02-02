import { useState } from 'react';
import CreateListingForm from '../components/CreateListingForm';

export default function Dashboard() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div>
      <h1>TEST - DASHBOARD PAGE LOADING</h1>
      <p>If you see this, React is working!</p>
      <button onClick={() => setShowCreateForm(!showCreateForm)}>
        {showCreateForm ? 'Hide Form' : 'Show Form'}
      </button>
      {showCreateForm && <CreateListingForm />}
    </div>
  );
}
