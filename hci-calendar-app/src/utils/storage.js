export const loadEvents = () => {
  const data = localStorage.getItem('plannerEvents');
  return data ? JSON.parse(data) : [];
};

export const saveEvents = (events) => {
  localStorage.setItem('plannerEvents', JSON.stringify(events));
};