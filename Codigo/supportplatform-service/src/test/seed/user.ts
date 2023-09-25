import {
    IUserAttributes,
    UserGithubOrganizationRoleEnum,
} from "../../model/User";

const UserTestingSeed: IUserAttributes[] = [
    {
        id: 1,
        githubId: "100",
        githubLogin: "user1",
        githubEmail: "email@email.com",
        githubOrganizationRole: UserGithubOrganizationRoleEnum.ADMIN,
        githubName: "User 1",
        githubAvatarUrl: "https://avatars.githubusercontent.com/u/100?v=4",
    },
];

export { UserTestingSeed };
