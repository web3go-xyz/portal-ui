import Vue from "vue";
import Router from "vue-router";

import HomePage from "@/components/HomePage";
import ProfileHome from "@/components/profile/ProfileHome";
import ProfileIndex from "@/components/profile/ProfileIndex";
import Login from "@/components/user/Login";
import Register from "@/components/user/Register";
import UserInfo from "@/components/user/UserInfo";
import VerifyEmail from "@/components/user/VerifyEmail";
import VerifyCode from "@/components/user/VerifyCode";
import ResetPsd from "@/components/user/ResetPsd";

import WalletProfiler from "@/components/walletProfiler/WalletProfiler";
import WalletProfilerDetail from "@/components/walletProfiler/WalletProfilerDetail";
import WalletLabelSetting from "@/components/walletProfiler/WalletLabelSetting";

import ParaChainProfiler4Kusama from "@/components/paraChainProfiler/kusama/ParaChainProfiler";
import ParaChainCrowdloanContributionDetail4Kusama from "@/components/paraChainProfiler/kusama/ContributionDetail";

import ParaChainProfiler4Polkadot from "@/components/paraChainProfiler/polkadot/ParaChainProfiler";
import ParaChainCrowdloanContributionDetail4Polkadot from "@/components/paraChainProfiler/polkadot/ContributionDetail";

import CDPProfiler from "@/components/cdpProfiler/CDPProfiler";
import CDPDetail from "@/components/cdpProfiler/CDPDetail";
import CustomQuery from "@/components/customQuery/CustomQuery";

import MoonRiver from "@/components/moonRiver/index";
import CollectorDetail from "@/components/moonRiver/CollectorDetail";
import DelegatorDetail from "@/components/moonRiver/DelegatorDetail";

import moonBeam from "@/components/moonBeam/index";
import moonBeamCollectorDetail from "@/components/moonBeam/CollectorDetail";
import moonBeamDelegatorDetail from "@/components/moonBeam/DelegatorDetail";

import MaintenanceDashboard from "@/components/sysConfig/MaintenanceDashboard";
import AddressTagManage from "@/components/sysConfig/sub/AddressTagManage";
import ParaChainManage from "@/components/sysConfig/sub/ParaChainManage";
import RMRKNFTNameUpdate from "@/components/sysConfig/sub/RMRKNFTNameUpdate";


import NFTProfiler from "@/components/nft/NftProfiler";
import NftDetail from "@/components/nft/NftDetail";
import NftDetailBeakdown from "@/components/nft/NftDetailBeakdown";
import NftItemDetail from "@/components/nft/NftItemDetail";
import NFTMintMaster from "@/components/nft/NFTMintMaster";
import NFTGraph from "@/components/nft/NFTGraph";

Vue.use(Router);

//fix  NavigationDuplicated: Avoided redundant navigation to current location
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
}
export default new Router({
    routes: [{
            path: "/",
            name: "HomePage",
            component: HomePage
        },
        {
            path: "/ProfileHome",
            name: "ProfileHome",
            meta: {
                parent: 'Profile'
            },
            component: ProfileHome
        },
        {
            path: "/ProfileIndex/:nav?",
            name: "ProfileIndex",
            meta: {
                parent: 'Profile'
            },
            component: ProfileIndex
        },
        {
            path: "/NFTProfiler",
            name: "NFTProfiler",
            component: NFTProfiler
        },
        {
            path: "/NftDetail",
            name: "NftDetail",
            component: NftDetail
        },
        {
            path: "/NftDetailBeakdown",
            name: "NftDetailBeakdown",
            component: NftDetailBeakdown
        },
        {
            path: "/NftItemDetail",
            name: "NftItemDetail",
            component: NftItemDetail
        },
        {
            path: "/NFTMintMaster",
            name: "NFTMintMaster",
            component: NFTMintMaster
        },
        {
            path: "/NFTGraph",
            name: "NFTGraph",
            component: NFTGraph
        },
        {
            path: "/Login",
            name: "Login",
            meta: {
                noHead: true
            },
            component: Login
        },
        {
            path: "/Register",
            name: "Register",
            meta: {
                noHead: true
            },
            component: Register
        },
        {
            path: "/UserInfo",
            name: "UserInfo",
            component: UserInfo
        },
        {
            path: "/VerifyEmail",
            name: "VerifyEmail",
            meta: {
                noHead: true
            },
            component: VerifyEmail
        },
        {
            path: "/VerifyCode",
            name: "VerifyCode",
            meta: {
                noHead: true
            },
            component: VerifyCode
        },
        {
            path: "/ResetPsd",
            name: "ResetPsd",
            meta: {
                noHead: true
            },
            component: ResetPsd
        },
        {
            path: "/WalletProfiler",
            name: "WalletProfiler",
            component: WalletProfiler
        },

        {
            path: "/WalletProfilerDetail",
            name: "WalletProfilerDetail",
            meta: {
                noHead: true
            },
            component: WalletProfilerDetail
        },
        {
            path: "/WalletLabelSetting",
            name: "WalletLabelSetting",
            component: WalletLabelSetting
        },

        {
            path: "/ParaChainProfiler",
            name: "ParaChainProfiler",
            component: ParaChainProfiler4Kusama
        },
        {
            path: "/ParaChainProfiler4Polkadot",
            name: "ParaChainProfiler4Polkadot",
            component: ParaChainProfiler4Polkadot
        },
        {
            path: "/ParaChainCrowdloanContributionDetail",
            name: "ParaChainCrowdloanContributionDetail",
            component: ParaChainCrowdloanContributionDetail4Kusama
        },
        {
            path: "/ParaChainCrowdloanContributionDetail4Polkadot",
            name: "ParaChainCrowdloanContributionDetail4Polkadot",
            component: ParaChainCrowdloanContributionDetail4Polkadot
        },
        {
            path: "/CDPProfiler",
            name: "CDPProfiler",
            component: CDPProfiler
        },

        {
            path: "/CDPDetail",
            name: "CDPDetail",
            meta: {
                noHead: true
            },
            component: CDPDetail
        },

        {
            path: "/CustomQuery",
            name: "CustomQuery",
            component: CustomQuery
        },
        {
            path: "/MoonRiver",
            name: "MoonRiver",
            component: MoonRiver
        },
        {
            path: "/CollectorDetail",
            name: "CollectorDetail",
            meta: {
                noHead: true
            },
            component: CollectorDetail
        },
        {
            path: "/DelegatorDetail",
            name: "DelegatorDetail",
            meta: {
                noHead: true
            },
            component: DelegatorDetail
        },
        {
            path: "/moonBeam",
            name: "moonBeam",
            component: moonBeam
        },
        {
            path: "/moonBeamCollectorDetail",
            name: "moonBeamCollectorDetail",
            meta: {
                noHead: true
            },
            component: moonBeamCollectorDetail
        },
        {
            path: "/moonBeamDelegatorDetail",
            name: "moonBeamDelegatorDetail",
            meta: {
                noHead: true
            },
            component: moonBeamDelegatorDetail
        },
        {
            path: "/MaintenanceDashboard",
            name: "MaintenanceDashboard",
            meta: {
                noHead: true
            },
            components: {
                default: MaintenanceDashboard
            },
            children: [{
                    path: "/MaintenanceDashboard/AddressTagManage",
                    name: "MaintenanceDashboard-AddressTagManage",
                    meta: {
                        noHead: true
                    },
                    components: {
                        sub: AddressTagManage
                    }
                },
                {
                    path: "/MaintenanceDashboard/ParaChainManage",
                    name: "MaintenanceDashboard-ParaChainManage",
                    meta: {
                        noHead: true
                    },
                    components: {
                        sub: ParaChainManage
                    }
                },
                {
                    path: "/MaintenanceDashboard/RMRKNFTNameUpdate",
                    name: "MaintenanceDashboard-RMRKNFTNameUpdate",
                    meta: {
                        noHead: true
                    },
                    components: {
                        sub: RMRKNFTNameUpdate
                    }
                }
            ]
        }
    ]
});