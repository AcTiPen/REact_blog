import { Avatar, Divider } from 'antd'
import '../static/style/components/author.css'
const Author=()=>{
    return (
        <div className='author-div common-box'>
            <div>
                {/* 设置头像 */}
                <Avatar size={150} src='../static/picture/CERBERUS-0.jpg'/>
            </div>
            <div className='author-introduction'>
                我希望生活能够更加幸福
                <Divider>社交账号</Divider>
                <Avatar size={36} icon='github' className='account'/>
                <Avatar size={36} icon='qq' className='account'/>
                <Avatar size={36} icon='wechat' className='account'/>
            </div>
        </div>
    )
}
export default Author