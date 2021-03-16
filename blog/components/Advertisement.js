//全静态页面用来展示广告，因为广告可能很久才更换所以不需要动态加载
//减少服务器压力
import '../static/style/components/advertisement.css'
const Advertisement = () => {
    return (
        <div className='ad-div common-box'>
            {/* 这里使用的100%并不是完全显示图片的意思，只是完全填充父级div */}
            <div>
                <img src='../static/picture/blue.jpg' width='100%' />
            </div>
            <div>
                <img src='../static/picture/green.jpg' width='100%' />
            </div>
            <div>
                <img src='../static/picture/pink.jpg' width='100%' />
            </div>
            <div>
                <img src='../static/picture/purple.jpg' width='100%' />
            </div>
        </div>
    )
}
export default Advertisement