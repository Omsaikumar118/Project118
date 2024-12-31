export const mockCommunications = [
  {
    id: 1,
    companyName: "Acme Corp",
    method: "Email",
    dueDate: new Date().toISOString(), // Today
    status: "pending",
    contactPerson: "John Doe",
    contactEmail: "john@acme.com"
  },
  {
    id: 2,
    companyName: "TechStart Inc",
    method: "Phone",
    dueDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    status: "overdue",
    contactPerson: "Jane Smith",
    contactEmail: "jane@techstart.com"
  },
  {
    id: 3,
    companyName: "Global Solutions",
    method: "Meeting",
    dueDate: new Date().toISOString(), // Today
    status: "pending",
    contactPerson: "Mike Johnson",
    contactEmail: "mike@globalsolutions.com"
  }
]; 