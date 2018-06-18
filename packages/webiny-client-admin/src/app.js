import { app } from "webiny-client";
import { app as uiApp } from "webiny-client-ui";
import MenuService from "./services/Menu";
import Menu from "./components/Menu";
import { i18n } from "webiny-client";
import React from "react";

const t = i18n.namespace("Admin.App");

export default () => {
    return (params, next) => {
        Promise.all([new Promise(res => uiApp()(params, res))]).then(() => {
            app.services.register("menu", () => new MenuService());

            app.modules.register([
                {
                    name: "Admin.Layout",
                    factory: () => import("./components/Layouts/AdminLayout")
                },
                {
                    name: "Admin.EmptyLayout",
                    factory: () => import("./components/Layouts/EmptyLayout")
                },
                {
                    name: "Admin.Header",
                    factory: () => import("./components/Header")
                },
                {
                    name: "Admin.Footer",
                    factory: () => import("./components/Footer")
                },
                {
                    name: "Admin.Logo",
                    factory: () => import("./components/Logo"),
                    tags: ["header-component"]
                },
                {
                    name: "Admin.Navigation",
                    factory: () => import("./components/Navigation")
                },
                {
                    name: "Admin.Navigation.Desktop",
                    factory: () => import("./components/Navigation/Desktop")
                },
                {
                    name: "Admin.Navigation.Mobile",
                    factory: () => import("./components/Navigation/Mobile")
                }
            ]);

            app.modules.register([
                {
                    name: "Admin.UserMenu",
                    factory: () => import("./admin/components/UserMenu"),
                    tags: ["header-component"]
                },
                {
                    name: "Admin.Login",
                    factory: () => import("./admin/views/Login")
                },
                {
                    name: "Admin.UserMenu.AccountPreferences",
                    factory: () => import("./admin/components/UserMenu/AccountPreferences"),
                    tags: ["user-menu-item"]
                },
                {
                    name: "Admin.UserMenu.Logout",
                    factory: () => import("./admin/components/UserMenu/Logout"),
                    tags: ["user-logout-menu-item"]
                },
                {
                    name: "Admin.UserAccountForm",
                    factory: () => import("./admin/components/UserAccount/UserAccountForm")
                }
            ]);

            app.router.addRoute({
                name: "Login",
                path: "/login",
                exact: true,
                render: () =>
                    app.modules.load("Admin.Login").then(Login => {
                        return (
                            <Login
                                identity={"SecurityUser"}
                                strategy={"credentials"}
                                onSuccess={() => {
                                    app.router.goToRoute("Dashboard");
                                }}
                            />
                        );
                    }),
                title: "Login"
            });

            app.router.addRoute({
                name: "Me.Account",
                path: "/me",
                render: () =>
                    app.modules.load("Admin.UserAccountForm").then(AccountForm => {
                        return <AccountForm />;
                    }),
                title: "My Account"
            });

            // Security management module.
            app.modules.register({
                name: "Security.SecurityToggleList",
                factory: () => import("./admin/views/SecurityToggleList")
            });

            const securityManager = "webiny-security-manager";

            app.services.get("menu").add(
                <Menu label={t`Security`} icon="user-secret">
                    <Menu label={t`Identities`} group={securityManager}>
                        <Menu label={t`Users`} route="Users.List" />
                        <Menu label={t`API Tokens`} route="ApiTokens.List" />
                    </Menu>
                    <Menu label={t`User Management`} group={securityManager}>
                        <Menu label={t`Groups`} route="Groups.List" />
                        <Menu label={t`Policies`} route="Policies.List" />
                    </Menu>
                </Menu>
            );

            app.router.addRoute({
                name: "Users.Create",
                path: "/users/new",
                component: () => import("./admin/views/UsersForm").then(m => m.default),
                title: "Security - Create User",
                group: securityManager
            });

            app.router.addRoute({
                name: "Users.Edit",
                path: "/users/:id",
                component: () => import("./admin/views/UsersForm").then(m => m.default),
                title: "Security - Edit User",
                group: securityManager
            });

            app.router.addRoute({
                name: "Users.List",
                path: "/users",
                component: () => import("./admin/views/UsersList").then(m => m.default),
                title: "Security - Users",
                group: securityManager
            });

            app.router.addRoute({
                name: "ApiTokens.Create",
                path: "/api-tokens/new",
                component: () => import("./admin/views/ApiTokensForm").then(m => m.default),
                title: "Security - Create Token",
                group: securityManager
            });

            app.router.addRoute({
                name: "ApiTokens.Edit",
                path: "/api-tokens/:id",
                component: () => import("./admin/views/ApiTokensForm").then(m => m.default),
                title: "Security - Edit Token",
                group: securityManager
            });

            app.router.addRoute({
                name: "ApiTokens.List",
                path: "/api-tokens",
                component: () => import("./admin/views/ApiTokensList").then(m => m.default),
                title: "Security - Tokens",
                group: securityManager
            });

            app.router.addRoute({
                name: "Groups.Create",
                path: "/groups/new",
                component: () => import("./admin/views/GroupsForm").then(m => m.default),
                title: "Security - Create Group",
                group: securityManager
            });

            app.router.addRoute({
                name: "Groups.Edit",
                path: "/groups/:id",
                component: () => import("./admin/views/GroupsForm").then(m => m.default),
                title: "Security - Edit Group",
                group: securityManager
            });

            app.router.addRoute({
                name: "Groups.List",
                path: "/groups",
                component: () => import("./admin/views/GroupsList").then(m => m.default),
                title: "Security - Groups",
                group: securityManager
            });

            app.router.addRoute({
                name: "Policies.Create",
                path: "/policies/new",
                component: () => import("./admin/views/PoliciesForm").then(m => m.default),
                title: "Security - Create Policy",
                group: securityManager
            });

            app.router.addRoute({
                name: "Policies.Edit",
                path: "/policies/:id",
                component: () => import("./admin/views/PoliciesForm").then(m => m.default),
                title: "Security - Edit Policy",
                group: securityManager
            });

            app.router.addRoute({
                name: "Policies.List",
                path: "/policies",
                component: () => import("./admin/views/PoliciesList").then(m => m.default),
                title: "Security - Policies",
                group: securityManager
            });

            next();
        });
    };
};