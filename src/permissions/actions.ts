export const ACTION_ALL = {
  id: '0',
  name: 'All',
  description: 'Super Action can invoke any actions',
};

export const ACTION_USER_READ = {
  id: '1',
  name: 'user.read',
  description: 'Read all users',
};

export const ACTION_USER_WRITE = {
  id: '2',
  name: 'user.write',
  description: 'Create, update, delete all users',
};

export const ACTION_BOOKMARK_READ = {
  id: '3',
  name: 'bookmark.read',
  description: 'Read all owned bookmarks',
};

export const ACTION_BOOKMARK_WRITE = {
  id: '4',
  name: 'bookmark.write',
  description: 'Create, update, delete the owned bookmarks',
};

export const ACTION_BOOKMARK_READ_ALL = {
  id: '5',
  name: 'bookmark.read.all',
  description: 'Read all the bookmarks (admin)',
};

export const ACTION_BOOKMARK_WRITE_ALL = {
  id: '6',
  name: 'bookmark.write.all',
  description: 'Create, update, delete the bookmarks (admin)',
};

export const ALL_ACTIONS = [
  ACTION_ALL,
  ACTION_USER_READ,
  ACTION_USER_WRITE,
  ACTION_BOOKMARK_READ,
  ACTION_BOOKMARK_WRITE,
  ACTION_BOOKMARK_READ_ALL,
  ACTION_BOOKMARK_WRITE_ALL,
];
