const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];

export const basePath =
  process.env.GITHUB_ACTIONS === "true" && repositoryName
    ? `/${repositoryName}/`
    : "/";

export const basename = basePath;
