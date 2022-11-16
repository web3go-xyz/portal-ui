import Vue from "vue";
import Router from "vue-router";

import HomePage from "@/components/HomePage";
import ProfileHome from "@/components/profile/ProfileHome";
import Insight from "@/components/Insight";
import InsightDetail from "@/components/Insight/InsightDetail";
import BAS from "@/components/BAS";

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

import Moonriver from "@/components/moonRiver/index";
import CollectorDetail from "@/components/moonRiver/CollectorDetail";
import DelegatorDetail from "@/components/moonRiver/DelegatorDetail";

import Moonbeam from "@/components/moonBeam/index";
import MoonbeamCollectorDetail from "@/components/moonBeam/CollectorDetail";
import MoonbeamDelegatorDetail from "@/components/moonBeam/DelegatorDetail";

import StakingTemplateA from "@/components/staking/templateA/index";
import StakingTemplateA_CollectorDetail from "@/components/staking/templateA/CollectorDetail";
import StakingTemplateA_DelegatorDetail from "@/components/staking/templateA/DelegatorDetail";


import MaintenanceDashboard from "@/components/sysConfig/MaintenanceDashboard";
import AddressTagManage from "@/components/sysConfig/sub/AddressTagManage";
import ParaChainManage from "@/components/sysConfig/sub/ParaChainManage";
import RMRKNFTNameUpdate from "@/components/sysConfig/sub/RMRKNFTNameUpdate";
import InsightManage from "@/components/sysConfig/sub/InsightManage";


import NFTProfiler from "@/components/nft/NftProfiler";
import NftDetail from "@/components/nft/NftDetail";
import NftDetailBeakdown from "@/components/nft/NftDetailBeakdown";
import NftItemDetail from "@/components/nft/NftItemDetail";
import NFTMintMaster from "@/components/nft/NFTMintMaster";
import NFTGraph from "@/components/nft/NFTGraph";
import NFTTimeMachine from "@/components/nft/NFTTimeMachine";



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
        path: "/Insight",
        name: "Insight",
        meta: {
            parent: 'Insight'
        },
        component: Insight
    },
    {
        path: "/BAS",
        name: "BAS",
        meta: {
            parent: 'BAS'
        },
        component: BAS
    },
    {
        path: "/InsightDetail",
        name: "InsightDetail",
        meta: {
            parent: 'Insight'
        },
        component: InsightDetail
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
        path: "/NFTTimeMachine",
        name: "NFTTimeMachine",
        component: NFTTimeMachine
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
    // {
    //     path: "/Moonriver",
    //     name: "Moonriver",
    //     component: Moonriver
    // },
    // {
    //     path: "/CollectorDetail",
    //     name: "CollectorDetail",
    //     meta: {
    //         noHead: true
    //     },
    //     component: CollectorDetail
    // },
    // {
    //     path: "/DelegatorDetail",
    //     name: "DelegatorDetail",
    //     meta: {
    //         noHead: true
    //     },
    //     component: DelegatorDetail
    // },
    {
        path: "/Moonbeam",
        name: "Moonbeam",
        component: Moonbeam
    },
    {
        path: "/MoonbeamCollectorDetail",
        name: "MoonbeamCollectorDetail",
        meta: {
            noHead: true
        },
        component: MoonbeamCollectorDetail
    },
    {
        path: "/MoonbeamDelegatorDetail",
        name: "MoonbeamDelegatorDetail",
        meta: {
            noHead: true
        },
        component: MoonbeamDelegatorDetail
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
        }, {
            path: "/MaintenanceDashboard/InsightManage",
            name: "MaintenanceDashboard-InsightManage",
            meta: {
                noHead: true
            },
            components: {
                sub: InsightManage
            }
        },
        ]
    },

    {
        path: "/BifrostStaking",
        name: "BifrostStaking",
        component: StakingTemplateA,
        meta: {
            parachain: {
                name: 'Bifrost',
                icon: 'static/parachain-icon/bifrost.svg',
                symbol: 'BNC',
                decimals: 12,
                minBond: 50,
                // canDelegate: true,
                walletSupport: 'polkadot.js',
                // walletSupport: 'MetaMask',
                ss58Format: 6, // polkadot.js 
                rpcUrls: [window.BIFROST_WSS || "wss://bifrost-rpc.liebi.com/ws"], //MetaMask,polkadot.js 

                // chainId: "0x504", //MetaMask
                // blockExplorerUrls: ["https://bifrost.subscan.io/"], //MetaMask

            },
            base_api: window.BIFROST_STAKING_API
        },
    },
    {
        path: "/TuringStaking",
        name: "TuringStaking",
        component: StakingTemplateA,
        meta: {
            parachain: {
                name: 'Turing Network',
                icon: 'static/parachain-icon/oak-logo.png',
                symbol: 'TUR',
                decimals: 10,
                minBond: 50,
                canDelegate: true,
                walletSupport: 'polkadot.js',
                ss58Format: 51, // polkadot.js 
                rpcUrls: [window.OAK_TURING_WSS || "wss://rpc.turing.oak.tech"], //MetaMask,polkadot.js 
            },
            base_api: window.OAK_STAKING_API
        },
    },
    // {
    //     path: "/LitentryTestnetStaking",
    //     name: "LitentryTestnetStaking",
    //     component: StakingTemplateA,
    //     meta: {
    //         parachain: {
    //             name: 'Litentry Rococo Network',
    //             icon: 'static/parachain-icon/litentry.png',
    //             symbol: 'LIT',
    //             decimals: 12,
    //             minBond: 50,
    //             canDelegate: true,
    //             delegateParameterCount: 2,
    //             walletSupport: 'polkadot.js',
    //             ss58Format: 131, // polkadot.js 
    //             rpcUrls: ["wss://rpc.rococo-parachain-sg.litentry.io"], //MetaMask,polkadot.js
    //         },
    //         base_api: window.LITENTRY_STAKING_TESTNET_API
    //     },
    // },
    {
        path: "/LitentryMainnetStaking",
        name: "LitentryMainnetStaking",
        component: StakingTemplateA,
        meta: {
            parachain: {
                name: 'Litentry Mainnet Network',
                icon: 'static/parachain-icon/litentry.png',
                symbol: 'LIT',
                decimals: 12,
                minBond: 50,
                canDelegate: true,
                delegateParameterCount: 2,
                walletSupport: 'polkadot.js',
                ss58Format: 31, // polkadot.js 
                rpcUrls: ["wss://rpc.litentry-parachain.litentry.io"], //MetaMask,polkadot.js
            },
            base_api: window.LITENTRY_STAKING_MAINNET_API
        },
    },
    {
        path: "/CalamariStaking",
        name: "CalamariStaking",
        component: StakingTemplateA,
        meta: {
            parachain: {
                name: 'Calamari Network',
                icon: 'static/parachain-icon/calamari.png',
                symbol: 'KMA',
                decimals: 12,
                minBond: 5000,
                canDelegate: true,
                delegateParameterCount: 4,
                walletSupport: 'polkadot.js',
                ss58Format: 78, // polkadot.js 
                rpcUrls: ["wss://ws.calamari.systems/"], //MetaMask,polkadot.js
            },
            base_api: window.CALAMARI_STAKING_MAINNET_API
        },
    },
    {
        path: "/Moonriver",
        name: "Moonriver",
        component: StakingTemplateA,
        meta: {
            parachain: {
                name: 'Moonriver',
                icon: 'static/parachain-icon/moonriver.png',
                symbol: 'MOVR',
                decimals: 18,
                minBond: 5,
                canDelegate: false,
                walletSupport: 'MetaMask',
                chainId: "0x505", //MetaMask Moonriver
                rpcUrls: ["https://rpc.moonriver.moonbeam.network"], //MetaMask,polkadot.js 
                blockExplorerUrls: ["https://moonriver.subscan.io/"], //MetaMask 
            },
            base_api: window.MOONRIVER_API
        },
    },
    {
        path: "/StakingCollectorDetail",
        name: "StakingCollectorDetail",
        meta: {
            noHead: true
        },
        component: StakingTemplateA_CollectorDetail
    },
    {
        path: "/StakingDelegatorDetail",
        name: "StakingDelegatorDetail",
        meta: {
            noHead: true
        },
        component: StakingTemplateA_DelegatorDetail
    },
    ]
});
