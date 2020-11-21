import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/login.vue'
import SearchUser from '../components/searchUser.vue'
import AddUser from '../components/addUser.vue'
import UserDetail from '../components/userDetail.vue'
import RoleDetail from '../components/roleDetail.vue'
import PermissionDetail from '../components/permissionDetail.vue'
import GetMenu from '../components/getMenu.vue'
import GetUserMenu from '../components/getUserMenu.vue'
import AgencyList from '../components/agencyList.vue'
import CreatePublicClientUser from '../components/createPublicClientUser.vue'
import PublicUserList from '../components/publicUserList.vue'
import AddAgency from '../components/addAgency.vue'
import websocketTest from '../components/websocketTest.vue'
import AddPublicAccount from '../components/addPublicAccount.vue'
import HandlePublicAccount from '../components/handlePublicAccount.vue'
import PublicDemandDeposit from '../components/publicDemandDeposit.vue'
import PublicDemandToTime from '../components/PublicDemandToTime.vue'
import PublicDemandWithdraw from '../components/PublicDemandWithdraw.vue'
import PublicGetTimeDeposit from '../components/publicGetTimeDeposit.vue'
import PublicRate from '../components/publicRate.vue'
import PublicLoanRate from '../components/publicLoanRate.vue'
import PersonalRate from '../components/PersonalRate.vue'
import PersonalLoanRate from '../components/PersonalLoanRate.vue'
import EditAgency from '../components/editAgency.vue'
import CashManage from '../components/cashManage.vue'
import ExcelOutput from '../components/excelOutput.vue'
import LogList from '../components/logList.vue'
import Netting from '../components/netting.vue'
import Transaction from '../components/transaction.vue'
import Trunk from '../components/trunk.vue'
import TrunkCard from '../components/trunkCard.vue'
import MainView from '../components/mainView.vue'
import AddNotice from '../components/addNotice.vue'
import AnnouncementListP from '../components/announcementList.vue'
import PublicTimeDeposit from '../components/PublicTimeDeposit.vue'
import PublicTransfer from '../components/PublicTransfer.vue'
import AddPersonalClient from '../components/addPersonalClient.vue'
import PersonalClientList from '../components/personalClientList.vue'
import AddPersonalAccount from '../components/addPersonalAccount.vue'
import CancelPersonalAccount from '../components/cancelPersonalAccount.vue'
import CancelPublicAccount from '../components/cancelPublicAccount.vue'
import SendMail from '../components/sendMail.vue'
import ApplyForLoan from '../components/applyForLoan.vue'
import GetAllMail from '../components/getAllMail.vue'
import GetAllSentMail from '../components/getAllSentMail.vue'
import MailDetail from '../components/mailDetail.vue'
import SentMailDeatil from '../components/sentMailDetail.vue'
import HandleLoan from '../components/handleLoan.vue'
import LoanList from '../components/loanList.vue'
import AccountLoan from '../components/accountLoan.vue'
import PersonalDemandDeposit from '../components/personalDemandDeposit.vue'
import PersonalDemandToTime from '../components/personalDemandToTime.vue'
import PersonalDemandWithdraw from '../components/personalDemandWithdraw.vue'
import PersonalTimeDeposit from '../components/personalTimeDeposit.vue'
import PersonalGetTimeDeposit from '../components/personalGetTimeDeposit.vue'
import AnnouncementList from '../components/announcementListForUser.vue'
import PersonalTransfer from '../components/personalTransfer.vue'
import ECharts from '../components/Echarts.vue'
import vecharts from '../components/v-eharts.vue'
Vue.use(VueRouter)

const routes = [
	{
	  path: '/',
	  name: 'Home',
	  component: Home
	},
  {
    path: '/MainView',
    name: 'MainView',
    component: MainView,
	children:[
		{
		  path: '/ECharts',
		  name: 'ECharts',
		  component: ECharts
		},
		{
		  path: '/vecharts',
		  name: 'vecharts',
		  component: vecharts
		},
		{
		  path: '/PersonalTransfer',
		  name: 'PersonalTransfer',
		  component: PersonalTransfer
		},
		{
		  path: '/PersonalGetTimeDeposit',
		  name: 'PersonalGetTimeDeposit',
		  component: PersonalGetTimeDeposit
		},
		{
		  path: '/AnnouncementList',
		  name: 'AnnouncementList',
		  component: AnnouncementList
		},
		{
		  path: '/PersonalDemandDeposit',
		  name: 'PersonalDemandDeposit',
		  component: PersonalDemandDeposit
		},
		{
		  path: '/PersonalDemandToTime',
		  name: 'PersonalDemandToTime',
		  component: PersonalDemandToTime
		},
		{
		  path: '/PersonalDemandWithdraw',
		  name: 'PersonalDemandWithdraw',
		  component: PersonalDemandWithdraw
		},
		{
		  path: '/PersonalTimeDeposit',
		  name: 'PersonalTimeDeposit',
		  component: PersonalTimeDeposit
		},
		{
		  path: '/LoanList',
		  name: 'LoanList',
		  component: LoanList
		},
		{
		  path: '/AccountLoan',
		  name: 'AccountLoan',
		  component: AccountLoan
		},
		{
		  path: '/AddPersonalAccount',
		  name: 'AddPersonalAccount',
		  component: AddPersonalAccount
		},
		{
		  path: '/HandleLoan',
		  name: 'HandleLoan',
		  component: HandleLoan
		},
		{
		  path: '/SentMailDeatil',
		  name: 'SentMailDeatil',
		  component: SentMailDeatil
		},
		{
		  path: '/MailDetail',
		  name: 'MailDetail',
		  component: MailDetail
		},
		{
		  path: '/GetAllMail',
		  name: 'GetAllMail',
		  component: GetAllMail
		},
		{
		  path: '/GetAllSentMail',
		  name: 'GetAllSentMail',
		  component: GetAllSentMail
		},
		{
		  path: '/ApplyForLoan',
		  name: 'ApplyForLoan',
		  component: ApplyForLoan
		},
		{
		  path: '/SendMail',
		  name: 'SendMail',
		  component: SendMail
		},
		{
		  path: '/CancelPersonalAccount',
		  name: 'CancelPersonalAccount',
		  component: CancelPersonalAccount
		},
		{
		  path: '/CancelPublicAccount',
		  name: 'CancelPublicAccount',
		  component: CancelPublicAccount
		},
		{
		  path: '/AddPersonalClient',
		  name: 'AddPersonalClient',
		  component: AddPersonalClient
		},
		{
		  path: '/PersonalClientList',
		  name: 'PersonalClientList',
		  component: PersonalClientList
		},
		{
		  path: '/PublicTransfer',
		  name: 'PublicTransfer',
		  component: PublicTransfer
		},
		{
		  path: '/AnnouncementListP',
		  name: 'AnnouncementListP',
		  component: AnnouncementListP
		},
		{
		  path: '/PublicTimeDeposit',
		  name: 'PublicTimeDeposit',
		  component: PublicTimeDeposit
		},
		{
		  path: '/Transaction',
		  name: 'Transaction',
		  component: Transaction
		},
		{
		  path: '/AddNotice',
		  name: 'AddNotice',
		  component: AddNotice
		},
		{
		  path: '/TrunkCard',
		  name: 'TrunkCard',
		  component: TrunkCard
		},
		{
		  path: '/Trunk',
		  name: 'Trunk',
		  component: Trunk
		},
		{
		  path: '/EditAgency',
		  name: 'EditAgency',
		  component: EditAgency
		},
		{
		  path: '/Netting',
		  name: 'Netting',
		  component: Netting
		},
		{
		  path: '/LogList',
		  name: 'LogList',
		  component: LogList
		},
		{
		  path: '/ExcelOutput',
		  name: 'ExcelOutput',
		  component: ExcelOutput
		},
		{
		  path: '/CashManage',
		  name: 'CashManage',
		  component: CashManage
		},
		{
		  path: '/PersonalLoanRate',
		  name: 'PersonalLoanRate',
		  component: PersonalLoanRate
		},
		{
		  path: '/PersonalRate',
		  name: 'PersonalRate',
		  component: PersonalRate
		},
		{
		  path: '/AddAgency',
		  name: 'AddAgency',
		  component: AddAgency
		},
		{
		  path: '/PublicLoanRate',
		  name: 'PublicLoanRate',
		  component: PublicLoanRate
		},
		{
		  path: '/PublicRate',
		  name: 'PublicRate',
		  component: PublicRate
		},
		{
		  path: '/PublicGetTimeDeposit',
		  name: 'PublicGetTimeDeposit',
		  component: PublicGetTimeDeposit
		},
		{
		  path: '/PublicDemandToTime',
		  name: 'PublicDemandToTime',
		  component: PublicDemandToTime
		},
		{
		  path: '/PublicDemandWithdraw',
		  name: 'PublicDemandWithdraw',
		  component: PublicDemandWithdraw
		},
		{
		  path: '/PublicDemandDeposit',
		  name: 'PublicDemandDeposit',
		  component: PublicDemandDeposit
		},
		{
		  path: '/HandlePublicAccount',
		  name: 'HandlePublicAccount',
		  component: HandlePublicAccount
		},
		{
		  path: '/AddPublicAccount',
		  name: 'AddPublicAccount',
		  component: AddPublicAccount
		},
		{
		  path: '/websocketTest',
		  name: 'websocketTest',
		  component: websocketTest
		},
		{
		  path: '/UserDetail',
		  name: 'UserDetail',
		  component: UserDetail
		},
		{
		  path: '/AgencyList',
		  name: 'AgencyList',
		  component: AgencyList
		},
		{
		  path: '/SearchUser',
		  name: 'SearchUser',
		  component: SearchUser
		},
		{
		  path: '/CreatePublicClientUser',
		  name: 'CreatePublicClientUser',
		  component: CreatePublicClientUser
		},
		{
		  path: '/AddUser',
		  name: 'AddUser',
		  component: AddUser
		},
		{
		  path: '/RoleDetail',
		  name: 'RoleDetail',
		  component: RoleDetail
		},
		{
		  path: '/PermissionDetail',
		  name: 'PermissionDetail',
		  component: PermissionDetail
		},
		{
		  path: '/PublicUserList',
		  name: 'PublicUserList',
		  component: PublicUserList
		},
		{
		  path: '/GetMenu',
		  name: 'GetMenu',
		  component: GetMenu
		},
		{
		  path: '/GetUserMenu',
		  name: 'GetUserMenu',
		  component: GetUserMenu
		},
	]
  },
  
]

const router = new VueRouter({
  routes
})

export default router
