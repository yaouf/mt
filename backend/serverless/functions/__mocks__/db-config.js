// Mock database module
const mockDb = jest.fn();

// Add table function
mockDb.table = jest.fn().mockImplementation((tableName) => {
  // Return different mocks based on table name
  if (tableName === 'categories') {
    return {
      select: jest.fn().mockResolvedValue([
        { id: 1, name: "Breaking News" },
        { id: 2, name: "University News" },
        { id: 3, name: "Metro" },
        { id: 4, name: "Opinions" },
        { id: 5, name: "Arts and Culture" },
        { id: 6, name: "Sports" },
        { id: 7, name: "Science and Research" }
      ])
    };
  }
  
  // Default table mock
  return {
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnValue({
      first: jest.fn().mockResolvedValue(null),
      update: jest.fn().mockResolvedValue(1),
      delete: jest.fn().mockResolvedValue(1)
    }),
    first: jest.fn().mockResolvedValue(null),
    insert: jest.fn().mockResolvedValue([1]),
    update: jest.fn().mockResolvedValue(1),
    delete: jest.fn().mockResolvedValue(1)
  };
});

// Add destroy method
mockDb.destroy = jest.fn().mockResolvedValue(undefined);

// Export the mock factory
module.exports = function() {
  return mockDb;
};