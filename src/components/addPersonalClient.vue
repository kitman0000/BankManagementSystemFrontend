<template>
	<div>
		<el-form label-width="120px" v-model="personalUser">
			<el-form-item label="姓名:">
				<el-input style="width: 300px;" v-model="personalUser.name"  class="inp"></el-input>
			</el-form-item>
			<el-form-item label="国籍:">
				<el-input style="width: 300px;" v-model="personalUser.nation" class="inp"></el-input>
			</el-form-item>
			<el-form-item label="地址:">
				<el-input style="width: 500px;" placeholder="请输入地址" v-model="personalUser.address" class="inp"></el-input>
			</el-form-item>
			<el-form-item label="邮政编码:">
				<el-input style="width: 300px;" v-model="personalUser.postalCode" placeholder="请输入邮政编码" class="inp"></el-input>
			</el-form-item>
			<el-form-item label="证件类别:">
				<el-select v-model="personalUser.credentialsType" placeholder="请选择">
					<el-option v-for="item in personCredentialsType" :key="item.id" :label="item.label" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="证件号:">
				<el-input style="width: 300px;" v-model="personalUser.credentialsNumber" class="inp"></el-input>
			</el-form-item>
			<el-form-item label="签发地:">
				<el-input style="width: 300px;" v-model="personalUser.credentialsLocation"  class="inp"></el-input>
			</el-form-item>
			<el-form-item label="开户机构ID:">
				<el-input style="width: 300px;" v-model="personalUser.agencyID" placeholder="请输入开户机构ID" class="inp"></el-input>
				<el-button type="primary" icon="el-icon-plus" @click='selectAgency()'>选择开户机构</el-button>
			</el-form-item>
			<el-form-item label="日期:">
				<el-date-picker v-model="personalUser.authDate" type="date" placeholder="选择日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="手机号:">
				<el-input v-model="personalUser.telephoneNum" style="width: 300px;">
				</el-input>
			</el-form-item>
			<el-form-item label="备注:">
				<el-input v-model="personalUser.note" style="width: 300px;">
				</el-input>
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
				personalUser:{
					name:null,
					nation:null,
					address:null,
					postalCode:null,
					credentialsType:null,
					agencyID:null,
					authDate:null,
					telephoneNum:null,
					credentialsNumber:null,
					credentialsLocation:null,
					note:null
					
				},
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
				chosenClientType: null,
				chosenPersonType: null,
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
				area: [],
			}
		},
		methods: {
			handleChange(file, fileList) {
				this.fileList = fileList.slice(-3);
			},
			createPublicUser() {
				var parmas = new URLSearchParams();
				parmas.append("name",this.personalUser.name);
				parmas.append("nation",this.personalUser.nation);
				parmas.append("address",this.personalUser.address);
				parmas.append("postalCode",this.personalUser.postalCode);
				parmas.append("credentialsType",this.personalUser.credentialsType);
				parmas.append("agencyID",this.personalUser.agencyID);
				parmas.append("telephoneNum",this.personalUser.telephoneNum);
				parmas.append("credentialsNumber",this.personalUser.credentialsNumber);
				parmas.append("credentialsLocation",this.personalUser.credentialsLocation);
				parmas.append("note",this.personalUser.note);

				axios.post('/api/personalService/client',parmas, {
						headers: {
							"token": localStorage.getItem("token"),
						}
					})
					.then(res => {
						if(res.data == "ADD_CLIENT_SUCCESS"){
							this.$alert('添加成功', '提示', {
							         confirmButtonText: '确定',
							       });
						}
						else{
							this.$alert('添加失败', '提示', {
							         confirmButtonText: '确定',
							       });
						}
				
					}).catch(err=> {
						this.$alert('请求失败', '提示', {
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
				this.personalUser.agencyID = row;
				this.dialogVisible = false;
			}
		},
		beforeMount: function() {
			this.getCity();
			this.getDefaultAgencyList();
		},
	}
</script>
