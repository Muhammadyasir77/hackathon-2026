export const problems = [
  {
    id: 'p1',
    title: 'Garbage Overflowing on Main Bazaar Street',
    description:
      'Uncollected garbage has been piling up for over 2 weeks on Main Bazaar Street, causing serious health hazards and foul smells for nearby residents and shop owners.',
    story:
      'This street has been unclean for 2 weeks. Residents are facing health issues and children cannot play outside. Shop owners are losing business due to the stench and unsanitary conditions.',
    location: 'Main Bazaar Street, Lahore',
    category: 'Sanitation',
    beforeImage: 'https://picsum.photos/seed/garbage-street-1/700/420',
    afterImagePlaceholder: 'https://picsum.photos/seed/clean-street-after/700/420',
    funded: 5000,
    totalGoal: 5000,
    joinedCount: 12,
    displayStatus: 'Active',
    task: 'Clean and remove all garbage from the street area and restore sanitation',
    volunteer: { name: 'Ali', role: 'Volunteer', rating: 4.5, completedTasks: 8 },
    donations: [
      { donor: 'Donor_A', amount: 3000, status: 'ESCROW', time: '2 days ago' },
      { donor: 'Donor_B', amount: 2000, status: 'ESCROW', time: '1 day ago' },
    ],
    ledgerEntries: [
      { id: 'l1', from: 'Donor_A', to: 'Escrow Pool', amount: 3000, type: 'DEPOSIT', status: 'ESCROW', time: '2 days ago' },
      { id: 'l2', from: 'Donor_B', to: 'Escrow Pool', amount: 2000, type: 'DEPOSIT', status: 'ESCROW', time: '1 day ago' },
      { id: 'l3', from: 'Escrow Pool', to: 'Ali (Volunteer)', amount: 2500, type: 'RESERVE', status: 'RESERVED', time: 'Task taken' },
      { id: 'l4', from: 'Escrow Pool', to: 'Ali (Volunteer)', amount: 2500, type: 'RELEASE', status: 'PENDING', time: 'After verification' },
      { id: 'l5', from: 'Escrow Pool', to: 'Remaining Pool', amount: 2500, type: 'BALANCE', status: 'POOL', time: 'Ongoing' },
    ],
  },
  {
    id: 'p2',
    title: 'Broken Water Pipe Flooding Residential Lane',
    description:
      'A burst underground water pipe has been flooding Lane 7 for 5 days straight, making it impassable for vehicles and pedestrians and damaging property foundations.',
    story:
      'Families cannot leave their homes safely. Children are missing school. The water level is rising daily with no action from authorities. Elderly residents are stranded.',
    location: 'Garden Town Lane 7, Karachi',
    category: 'Infrastructure',
    beforeImage: 'https://picsum.photos/seed/flood-road-lane/700/420',
    afterImagePlaceholder: 'https://picsum.photos/seed/fixed-road-clean/700/420',
    funded: 8000,
    totalGoal: 8000,
    joinedCount: 27,
    displayStatus: 'Completed',
    task: 'Repair the burst water pipe, pump out the water, and restore the road',
    volunteer: { name: 'Zara', role: 'Volunteer', rating: 4.8, completedTasks: 14 },
    donations: [
      { donor: 'Donor_C', amount: 5000, status: 'PAID', time: '5 days ago' },
      { donor: 'Donor_D', amount: 3000, status: 'PAID', time: '4 days ago' },
    ],
    ledgerEntries: [
      { id: 'l1', from: 'Donor_C', to: 'Escrow Pool', amount: 5000, type: 'DEPOSIT', status: 'PAID', time: '5 days ago' },
      { id: 'l2', from: 'Donor_D', to: 'Escrow Pool', amount: 3000, type: 'DEPOSIT', status: 'PAID', time: '4 days ago' },
      { id: 'l3', from: 'Escrow Pool', to: 'Zara (Volunteer)', amount: 4000, type: 'RESERVE', status: 'PAID', time: '3 days ago' },
      { id: 'l4', from: 'Escrow Pool', to: 'Zara (Volunteer)', amount: 4000, type: 'RELEASE', status: 'PAID', time: '2 days ago' },
      { id: 'l5', from: 'Escrow Pool', to: 'Community Pool', amount: 4000, type: 'BALANCE', status: 'POOL', time: '2 days ago' },
    ],
  },
  {
    id: 'p3',
    title: 'Street Lights Non-functional in Gulshan Block',
    description:
      'Over 8 street lights have been broken for 3 weeks in Gulshan Block 14, creating a serious safety risk at night, especially for women and children returning home.',
    story:
      'Residents are afraid to step out after dark. Two robbery incidents were reported last week. The community needs light and safety restored urgently before more harm is done.',
    location: 'Gulshan Block 14, Islamabad',
    category: 'Safety & Lighting',
    beforeImage: 'https://picsum.photos/seed/dark-street-night/700/420',
    afterImagePlaceholder: 'https://picsum.photos/seed/lit-street-lights/700/420',
    funded: 3500,
    totalGoal: 3500,
    joinedCount: 8,
    displayStatus: 'Active',
    task: 'Repair and replace all 8 non-functional street lights in the block',
    volunteer: { name: 'Hassan', role: 'Technician', rating: 4.2, completedTasks: 5 },
    donations: [
      { donor: 'Donor_E', amount: 2000, status: 'ESCROW', time: '3 days ago' },
      { donor: 'Donor_F', amount: 1500, status: 'ESCROW', time: '2 days ago' },
    ],
    ledgerEntries: [
      { id: 'l1', from: 'Donor_E', to: 'Escrow Pool', amount: 2000, type: 'DEPOSIT', status: 'ESCROW', time: '3 days ago' },
      { id: 'l2', from: 'Donor_F', to: 'Escrow Pool', amount: 1500, type: 'DEPOSIT', status: 'ESCROW', time: '2 days ago' },
      { id: 'l3', from: 'Escrow Pool', to: 'Hassan (Volunteer)', amount: 1750, type: 'RESERVE', status: 'RESERVED', time: 'Task taken' },
      { id: 'l4', from: 'Escrow Pool', to: 'Hassan (Volunteer)', amount: 1750, type: 'RELEASE', status: 'PENDING', time: 'After verification' },
      { id: 'l5', from: 'Escrow Pool', to: 'Remaining Pool', amount: 1750, type: 'BALANCE', status: 'POOL', time: 'Ongoing' },
    ],
  },
];

export const getProblemById = (id) => problems.find((p) => p.id === id);
