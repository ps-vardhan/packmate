// Language and package manager mappings
export const languagePackageManagers = {
  "Node.js": ["npm", "yarn", "pnpm"],
  "Python": ["pip", "poetry", "conda"],
  "Java": ["maven", "gradle"],
  "C++": ["vcpkg", "conan"],
  "Rust": ["cargo"],
  "Go": ["go modules"]
};

export const languages = Object.keys(languagePackageManagers);

export const getPackageManagersForLanguage = (language) => {
  return languagePackageManagers[language] || [];
};
