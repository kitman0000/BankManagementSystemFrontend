<template>
	<div>
		<el-form label-width="120px">
			<el-form-item label="名称:">
				<el-input style="width: 300px;" v-model="name" placeholder="请输入开户人全称" class="inp"></el-input>
			</el-form-item>
			<el-form-item label="电话:">
				<el-input style="width: 300px;" placeholder="请输入电话" v-model="telephone" class="inp"></el-input>
			</el-form-item>
			<el-form-item label="地址:">
				<el-input style="width: 500px;" placeholder="请输入地址" v-model="address" class="inp"></el-input>
			</el-form-item>
			<el-form-item label="邮政编码:">
				<el-input style="width: 300px;" v-model="postalCode" placeholder="请输入邮政编码" class="inp"></el-input>
			</el-form-item>
			<el-form-item label="存款人类别:">
				<el-select v-model="chosenClientType" placeholder="请选择">
					<el-option v-for="item in clientType" :key="item.id" :label="item.label" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="组织机构代码:">
				<el-input style="width: 300px;" v-model="code" placeholder="请输入组织机构代码" class="inp"></el-input>
			</el-form-item>
			<el-form-item label="责任人类别:">
				<el-select v-model="chosenPersonType" placeholder="请选择">
					<el-option v-for="item in personType" :key="item.id" :label="item.label" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="责任人姓名:">
				<el-input style="width: 300px;" v-model="personName" placeholder="请输入责任人姓名" class="inp"></el-input>
			</el-form-item>
			<el-form-item label="责任人证件类别:">
				<el-select v-model="chosenPersonCredentialsType" placeholder="请选择">
					<el-option v-for="item in personCredentialsType" :key="item.id" :label="item.label" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="责任人证件号:">
				<el-input style="width: 300px;" v-model="personCredentialsNumber" placeholder="请输入责任人证件号" class="inp"></el-input>
			</el-form-item>
			<el-form-item label="行业类别:">
				<el-select v-model="chosenIndustryType" placeholder="请选择">
					<el-option v-for="item in industryType" :key="item.id" :label="item.label" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="注册资金:">
				<el-input style="width: 300px;" v-model="regCapital" placeholder="请输入注册资金" class="inp"></el-input>
			</el-form-item>
			<el-form-item label="地区代码:">
				<el-select v-model="areaCode" filterable placeholder="请输入关键词">
					<el-option v-for="item in area" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="经营范围:">
				<el-input style="width: 300px;" v-model="businessScope" placeholder="请输入经营范围" class="inp"></el-input>
			</el-form-item>
			<el-form-item label="证明文件:">
				<el-upload class="upload-demo" :auto-upload='false' action="https://jsonplaceholder.typicode.com/posts/" :on-change="handleChange"
				 :file-list="fileList">
					<el-button type="primary" icon="el-icon-plus" style="border: 0px ;">添加文件</el-button>
				</el-upload>
				<el-button type="primary" @click="sendFile()" v-if="fileList.length !=0" icon="el-icon-check" style="border: 0px ;">确认上传的文件</el-button>
			</el-form-item>
			<el-form-item label="税务登记证号:">
				<el-input style="width: 300px;" v-model="taxRegCertificateNum" placeholder="请输入税务登记证号" class="inp"></el-input>
			</el-form-item>
			<el-form-item label="开户机构ID:">
				<el-input style="width: 300px;" v-model="agencyID" placeholder="请输入开户机构ID" class="inp"></el-input>
				<el-button type="primary" icon="el-icon-plus" @click='selectAgency()'>选择开户机构</el-button>
			</el-form-item>
			<el-form-item label="开户日期:">
				<el-date-picker v-model="authDate" type="date" placeholder="选择日期">
				</el-date-picker>
			</el-form-item>
		</el-form>

		<el-dialog title="提示" :visible.sync="dialogVisible" width="60%">
			<el-table  style="width: 100%;" :data="agencyList">
				<el-table-column prop="name" label="机构名" width="250">
				</el-table-column>
				<el-table-column label="机构码" prop="bankCode" width="80">
				</el-table-column>
				<el-table-column label="操作" align="center" min-width="100">
					<template slot-scope="scope">
						<el-button type="text" @click="choseAgency(scope.row.id)">选择该机构</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination @current-change="search_page" :current-page="currentPage"
			layout=" prev, pager, next"  :total="agencyNumber" align='center'>
			</el-pagination>
		</el-dialog>
		<el-button @click='createPublicUser()' type="primary" icon="el-icon-check" style="border: 0px;position: relative; left:120px">确认提交</el-button>
	</div>
</template>

<script>
	import axios from 'axios';
	export default {
		data() {
			return {
				name: null,
				telephone: null,
				address: null,
				postalCode: null,
				code: null,
				agencyNumber:null,
				currentPage:1,
				dialogVisible:false,
				agencyList:[],
				personName: null,
				personCredentialsNumber: null,
				regCapital: null,
				fileList: [],
				list: [],
				options: [],
				path: '/public/certifiedDocuments/',
				areaCode: null,
				businessScope: null,
				certifiedDocuments: null,
				taxRegCertificateNum: null,
				agencyID: null,
				authDate: null,
				loading: false,
				clientType: [{
						id: 1,
						label: '企业法人'
					},
					{
						id: 2,
						label: '机关'
					},
					{
						id: 3,
						label: '事业单位'
					},
					{
						id: 4,
						label: '社会团体'
					},
					{
						id: 5,
						label: '军队'
					},
					{
						id: 6,
						label: '武警部队'
					},
					{
						id: 7,
						label: '民办非企业组织'
					},
					{
						id: 8,
						label: '非法人企业'
					},
					{
						id: 9,
						label: '外国驻华机构'
					},
					{
						id: 10,
						label: '个体工商户'
					},
					{
						id: 11,
						label: '单位设立的独立核算的附属机构'
					},
				],
				chosenClientType: null,
				chosenPersonType: null,
				personType: [{
						id: 1,
						label: '法定代表人'
					},
					{
						id: 2,
						label: '负责人'
					}
				],
				chosenPersonCredentialsType: null,
				personCredentialsType: [{
						id: 1,
						label: '身份证'
					},
					{
						id: 2,
						label: '户口簿'
					},
					{
						id: 3,
						label: '护照'
					},
					{
						id: 4,
						label: '军官（警官）证'
					}
				],
				chosenIndustryType: null,
				industryType: [{
						id: 'A',
						label: '农、林、牧、渔业'
					},
					{
						id: 'B',
						label: '采矿业'
					},
					{
						id: 'C',
						label: '制造业'
					},
					{
						id: 'D',
						label: '电力、热力、燃气及水生产和供应业'
					},
					{
						id: 'E',
						label: '建筑业'
					},
					{
						id: 'F',
						label: '批发和零售业'
					},
					{
						id: 'G',
						label: '交通运输、仓储和邮政业'
					},
					{
						id: 'H',
						label: '住宿和餐饮业'
					},
					{
						id: 'I',
						label: '信息传输、软件和信息技术服务业'
					},
					{
						id: 'J',
						label: '金融业'
					},
					{
						id: 'K',
						label: '房地产业'
					},
					{
						id: 'L',
						label: '租赁和商务服务业'
					},
					{
						id: 'M',
						label: '科学研究和技术服务业'
					},
					{
						id: 'N',
						label: '水利、环境和公共设施管理业'
					},
					{
						id: 'O',
						label: '居民服务、修理和其他服务业'
					},
					{
						id: 'P',
						label: '教育'
					},
					{
						id: 'Q',
						label: '卫生和社会工作'
					},
					{
						id: 'R',
						label: '文化、体育和娱乐业'
					},
					{
						id: 'S',
						label: '公共管理、社会保障和社会组织'
					},
					{
						id: 'T',
						label: '国际组织'
					},
				],
				area: [],
			}
		},
		methods: {
			handleChange(file, fileList) {
				this.fileList = fileList.slice(-3);
			},
			createPublicUser() {
				var parmas = new URLSearchParams();
				parmas.append("address", this.address);
				parmas.append("agencyID", this.agencyID);
				parmas.append("areaCode", this.areaCode);
				parmas.append("authDate", this.authDate);
				parmas.append("businessScope", this.businessScope);
				parmas.append("certifiedDocuments", this.certifiedDocuments);
				parmas.append("clientType", this.chosenClientType);
				parmas.append("code", this.code);
				parmas.append("industryType", this.chosenIndustryType);
				parmas.append("name", this.name);
				parmas.append("personCredentialsNumber", this.personCredentialsNumber);
				parmas.append("personCredentialsType", this.chosenPersonCredentialsType);
				parmas.append("personName", this.personName);
				parmas.append("personType", this.chosenPersonType);
				parmas.append("postalCode", this.postalCode);
				parmas.append("regCapital", this.regCapital);
				parmas.append("taxRegCertificateNum", this.taxRegCertificateNum);
				parmas.append("telephone", this.telephone);
				axios.post('/api/publicClient/client', parmas, {
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.$alert('添加客户成功', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			sendFile() {
				var fileParmas = new FormData();

				fileParmas.append('multipartFile', this.fileList[0].raw);
				fileParmas.append('path', this.path);
				axios.post('/api/file/file', fileParmas, {
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						this.$alert('文件上传成功', '提示', {
							confirmButtonText: '确定',
						});
						this.certifiedDocuments = this.path + res.data;
						console.log(this.certifiedDocuments);
					});
			},

			getCity() {
				axios.get('/api/agency/city', {
						params: {
							keywords: '',
						},
						headers: {
							"token": localStorage.getItem("token")
						}
					})
					.then(res => {
						this.area = res.data;
					})
					.catch(function(error) {
						this.$alert('请求失败', '提示', {
							confirmButtonText: '确定',
						});
					});
			},
			
			getDefaultAgencyList(){
				axios.get('/api/agency/agencyPage', {
					params: {
						keywords:'',
					},
					headers: {
						"token": localStorage.getItem("token"),
					}
				})
				.then(res => {
					this.agencyNumber = res.data * 10;
				})
				.catch(function(error) {
					this.$alert('请求失败', '提示', {
					         confirmButtonText: '确定',
					       });
				});
				
				
				
				axios.get('/api/agency/agencyList', {
					params: {
						keywords:'',
						page:1,
					},
					headers: {
						"token": localStorage.getItem("token"),
					}
				})
				.then(res => {
					this.agencyList = eval(res.data);
				})
				.catch(function(error) {
					this.$alert('请求失败', '提示', {
					         confirmButtonText: '确定',
					       });
				});
			},
			search_page(currentPage){
				console.log(currentPage);
				this.currentPage = currentPage;
				axios.get('/api/agency/agencyList', {
					params: {
						keywords:'',
						page:this.currentPage,
					},
					headers: {
						"token": localStorage.getItem("token"),
					}
				})
				.then(res => {
					this.agencyList = eval(res.data);
				})
				.catch(function(error) {
					this.$alert('请求失败', '提示', {
					         confirmButtonText: '确定',
					       });
				});
			},
			selectAgency(){
				this.dialogVisible = true;
			},
			choseAgency(row){
				this.agencyID = row;
				this.dialogVisible = false;
			}
		},
		beforeMount: function() {
			this.getCity();
			this.getDefaultAgencyList();
		},
	}
</script>
