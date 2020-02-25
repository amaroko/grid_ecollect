
const Home = {
    text: 'Home',
    link: '/home',
    icon: 'icon-home'
};

const Guarantors = {
    text: 'Guarantors',
    link: '/guarantors/list',
    icon: 'icon-people'
};

const Manuals = {
    text: 'Manuals and scripts',
    link: '/manuals/all',
    icon: 'icon-people'
};

const Dashboard = {
    text: 'Dashboard',
    link: '/dashboard',
    icon: 'icon-speedometer',
    submenu: [
        {
            text: 'Dashboards',
            link: '/reports/dashboards'
        }
    ]
};

const Reports = {
    text: 'Reports',
    link: '/reports/allreports',
    icon: 'icon-speedometer'
};


/*const Reports = {
    text: 'Reports',
    link: '/dashboard',
    icon: 'icon-speedometer',
    submenu: [
        {
            text: 'Reports',
            link: '/reports/allreports'
        }
    ]
};*/

const DashboardAdmin = {
    text: 'Dashboard',
    link: '/dashboard',
    icon: 'icon-speedometer',
    submenu: [
        {
            text: 'Performance Metrics',
            link: '/dashboard/v3'
        }
    ]
};

const Letters = {
    text: 'Demands Letters',
    link: '/letters',
    icon: 'icon-note',
    submenu: [
        /*{
            text: 'Letters Due',
            link: '/demand/demands',
            alert: '0',
            label: 'badge badge-danger'
        },
        {
            text: 'Sent History',
            link: '/demand/demandhistory',
            alert: '0',
            label: 'badge badge-danger'
        }*/
        {
            text: 'Guarantors',
            link: '/guarantors',
            submenu: [
                {
                    text: 'list',
                    link: '/guarantors/list'
                },
                {
                    text: 'New',
                    link: '/guarantors/newguarantor'
                }
            ]
        },
        {
            text: 'Loans',
            link: '/demand',
            submenu: [
                {
                    text: 'Letters Due',
                    link: '/demand/demands'
                },
                {
                    text: 'Sent History',
                    link: '/demand/demandhistory'
                }
            ]
        },
        {
            text: 'Credit Cards',
            link: '/letters',
            submenu: [
                {
                    text: 'Demands due',
                    link: '/creditcards/creditcarddemands/demandsdue'
                },
                {
                    text: 'Demands history',
                    link: '/creditcards/creditcarddemands/demandshistory'
                }
            ]
        }
    ]
   /* ,
    'alert': 'new',
    'label': 'badge badge-danger'*/
};

const Letterscc = {
    text: 'Demands C-Cards',
    link: '/letters',
    icon: 'icon-note',
    submenu: [
        {
            text: 'Demands due',
            link: '/creditcards/creditcarddemands/demandsdue'
        },
        {
            text: 'Demands history',
            link: '/creditcards/creditcarddemands/demandshistory'
        }
    ]
   /* ,
    'alert': '0',
    'label': 'badge badge-danger'*/
};

const Administration = {
    text: 'Administration',
    link: '/admin',
    icon: 'icon-settings',
    submenu: [
        {
            text: 'Users',
            link: '/users/search'
        },
        {
            text: 'Roles',
            link: '/users/roles'
        },
        {
            text: 'Approvals',
            link: '/users/approvals'
        },
        {
            text: 'Branches',
            link: '/users/branches'
        }
    ]
};


const Forms = {
    text: 'Forms',
    link: '/forms',
    icon: 'icon-note',
    submenu: [
        {
            text: 'Standard',
            link: '/forms/standard'
        },
        {
            text: 'Extended',
            link: '/forms/extended'
        },
        {
            text: 'Validation',
            link: '/forms/validation'
        },
        {
            text: 'Upload',
            link: '/forms/upload'
        },
        {
            text: 'Image Crop',
            link: '/forms/cropper'
        }
    ]
};


const Work = {
    text: 'Loans Queue',
    link: '/work',
    icon: 'icon-briefcase',
    submenu: [
        {
            text: 'Loan arrears(ALL)',
            link: '/work/viewall'
            /*'alert': '23',
            'label': 'badge badge-warning'*/
        },
        {
            text: 'My allocations',
            link: '/work/myallocations'
        },
        {
            text: 'My worklist',
            link: '/work/myworklist'
        },
        {
            text: 'Broken PTPs',
            link: '/work/ptps'
        },
        {
            text: 'Trsactn acc with Funds',
            link: '/work/withfunds'
        },
        {
            text: 'View all Loans',
            link: '/work/allloans'
        },
        {
            text: 'No Credit buildup',
            link: '/watch/nocredit'
        },
        {
            text: 'Credit buildup',
            link: '/watch/creditbuildup'
        }
    ]
};

const Work_cc = {
    text: 'CreditCards Queue',
    link: '/creditcards',
    icon: 'icon-credit-card',
    submenu: [
        {
            text: 'Card arrears(ALL)',
            link: '/creditcards/viewall'
            /*'alert': '23',
            'label': 'badge badge-warning'*/
        },
        {
            text: 'My allocations',
            link: '/creditcards/myallocations'
        },
        {
            text: 'My Worklist',
            link: '/creditcards/myworklist'
        },
        {
            text: 'Cards Cr/Zero Bal',
            link: '/creditcards/zerobalance'
        },
        {
            text: 'View all Cards',
            link: '/creditcards/allcards'
        }
    ]
};

const Remedial = {
    text: 'Remedial',
    link: '/remedial',
    icon: 'icon-equalizer',
    submenu: [
        {
            text: 'Loan arrears(ALL)',
            link: '/work/viewall'
            /*'alert': '23',
            'label': 'badge badge-warning'*/
        },
        {
            text: 'My allocations',
            link: '/work/myallocations'
        },
        {
            text: 'My worklist',
            link: '/work/myworklist'
        },
        {
            text: 'Todays',
            link: '/work/todays'
        },
        {
            text: 'Broken PTPs',
            link: '/work/ptps'
        },
        {
            text: 'Tr accounts with Funds',
            link: '/work/withfunds'
        },
        {
            text: 'View all Loans',
            link: '/work/allloans'
        }
    ]
};

const serviceproviders = {
    text: 'Service Providers',
    link: '/serviceproviders',
    icon: 'icon-drawer',
    submenu: [
        {
            text: 'Debt Collectors',
            link: '/debtcollectors/allcases'
        },
        {
            text: 'Marketers',
            link: '/marketors/allcases'
        },
        {
            text: 'Auctioneers',
            link: '/auctioneers/allcases'
        },
        {
            text: 'Repossessors',
            link: '/repossessors/allcases'
        },
        {
            text: 'Investigators',
            link: '/investigators/allcases'
        },
        {
            text: 'Valuers',
            link: '/valuers/allcases'
        },
        {
            text: 'Service Providers Portal',
            link: '/spportal/portal'
        }
    ]
};

const mcoopcash = {
    text: 'E-Credit',
    link: '/mcoopcash',
    icon: 'icon-wallet',
    submenu: [
        {
            text: 'E-Credit arrears',
            link: '/mcoopcash/viewall'
        },
        {
            text: 'E-Credit All',
            link: '/mcoopcash/allecredit'
        }
    ]
};

const Demandletters = {
    text: 'Demand Letters',
    link: '/letters',
    icon: 'icon-envelope-letter',
    submenu: [
        {
            text: 'Demand settings',
            link: '/letters/settings'
        },
        {
            text: 'Demand automation',
            link: '/letters/automation'
        },
        {
            text: 'Customer suspensions',
            link: '/letters/customersuspensions'
        }
    ]
};

const Allocations = {
    text: 'Account allocations',
    link: '/allocations',
    icon: 'icon-people',
    submenu: [
        {
            text: 'Collection',
            link: '/allocations/collections'
        },
        {
            text: 'Remedial',
            link: '/allocations/remedial'
        },
        {
          text: 'Credit cards',
          link: '/allocations/creditcards'
        },
      {
        text: 'Pre Delq',
        link: '/allocations/predelq'
      }
    ]
};


const Insurance = {
  text: 'Insurance Companies',
  link: '/configurations/insurance',
  icon: 'icon-people'
};

const Predelq = {
  text: 'Paying Watch',
  link: '/payingwatch',
  icon: 'icon-wallet',
  submenu: [
    {
      text: 'No Credit buildup',
      link: '/watch/nocredit'
    },
        {
            text: 'Credit buildup',
            link: '/watch/creditbuildup'
        }
    ]
};

const SMS = {
    text: 'SMS',
    link: '/configurations/sms',
    icon: 'icon-note'
};

const AccountPlans = {
    text: 'Account Plans',
    link: '/configurations',
    icon: 'icon-note',
    submenu: [
        {
            text: 'Plans',
            link: '/configurations/accplans'
        },
        {
            text: 'Plan actions',
            link: '/configurations/planactions'
        },
        {
            text: 'Plan-Memo setup',
            link: '/configurations/planmemos'
        }
    ]
};

const headingMain = {
    text: 'Main Navigation',
    heading: true
};

const headingComponents = {
    text: 'Work Queue',
    heading: true
};

const headingDocumentations = {
    text: 'Documentation and Manuals',
    heading: true
};

const headingConfigurations = {
    text: 'Configurations',
    heading: true
};
const headingReports = {
    text: 'Reports',
    heading: true
};

const headingLetters = {
    text: 'Demand Letters',
    heading: true
};

// user permissions
const userperm = JSON.parse(localStorage.getItem('userpermission'));
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

let menuitems = [];

const user_mgmt_menu = [
    headingMain,
    Home,
    DashboardAdmin,
    Administration
];

const collection_menu = [
    headingMain,
    Home,
    headingComponents,
    Work,
    Work_cc,
    // Predelq,
    mcoopcash,
    serviceproviders,
    headingLetters,
    Letters,
    headingReports,
    Dashboard,
    Reports,
    headingDocumentations,
    Manuals
];

const creditcards_menu = [
    headingMain,
    Home,
    headingComponents,
    Work_cc,
    Work,
    // Predelq,
    mcoopcash,
    serviceproviders,
    headingLetters,
    Letters,
    headingReports,
    Dashboard,
    Reports,
    headingDocumentations,
    Manuals
];

const remedial_menu = [
    headingMain,
    Home,
    headingComponents,
    Remedial,
    Work_cc,
    // Predelq,
    mcoopcash,
    serviceproviders,
    headingLetters,
    Letters,
    headingReports,
    Dashboard,
    Reports,
    headingDocumentations,
    Manuals
];

const teamleader_menu = [
    headingMain,
    Home,
    headingComponents,
    Work,
    Work_cc,
    // Predelq,
  mcoopcash,
  serviceproviders,
  headingLetters,
  Letters,
  headingReports,
  Dashboard,
  Reports,
  headingConfigurations,
  Demandletters,
  Allocations,
  Insurance,
  SMS,
  AccountPlans,
  headingDocumentations,
  Manuals
];
// console.log('menu role==>', currentUser.role);
if (currentUser !== null) {
    if (currentUser.ROLE === 'admin' ) {
        menuitems = user_mgmt_menu;
    } else if (currentUser.ROLE === 'remedial') {
        menuitems = remedial_menu;
    } else if (currentUser.ROLE === 'creditcards') {
        menuitems = creditcards_menu;
    } else if (currentUser.ROLE === 'teamleader') {
        menuitems = teamleader_menu;
    } else if (currentUser.ROLE === 'telecollector') {
        menuitems = collection_menu;
    } else {
        menuitems = collection_menu;
    }
} else {
    menuitems = collection_menu;
}


export const menu = menuitems;
