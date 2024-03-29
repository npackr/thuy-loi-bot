import { getConfigurations } from "../../database/queries/common/getConfigurations.js";

const configurations = await getConfigurations();
const customPrefix = await configurations.find(config => config.name === "customPrefix");
const customName = await configurations.find(config => config.name === "customName");
const prefix = (customPrefix.value) ? customPrefix.options.BOT_BUZZ_WORD : "Thủy Lợi Ơi"
const botName = (customName.value) ? customName.options.BOT_NAME : "Thủy Lợi";

export const ADMIN_ID = "336096287407472641";
export const TELEGARM_BOT_USERNAME = "@thuyloi_bot";
export const BOT_NAME = botName;
export const BOT_BUZZ_WORD = prefix;
export const SUCCESSFUL_ICON = "✅";
export const ERROR_ICON = "❌";
export const SCHOOL_LOGO = "<:tls_logo:1028356562537951252>";
export const LOADING_STRING = `${SCHOOL_LOGO}  Đang xử lý yêu cầu của bạn, vui lòng đợi...`;
export const SOMETHING_WHEN_WRONG = "Có gì đó không đúng đã xảy ra, hãy thử liên hệ Điều hành viên";
export const FEATURE_ARE_IN_DEVELOPMENT = "Chức năng này đang được phát triển, vui lòng quay lại sau!";
export const DO_NOT_TALK_TO_FAST = `Hãy nói chậm hơn, ${BOT_NAME} nghe không kịp nè~`;
export const SCHOOL_NAME = "Phân hiệu Trường Đại học Thủy lợi";
export const YOU_ARE_IN_COOLDOWN_PLEASE_WAIT = "Vui lòng chờ hoàn thành lệnh hiện tại trước khi bắt đầu lệnh mới!\nThời gian chờ thực hiện lệnh dự kiến: ";
export const SECONDS = "giây";
export const ADMISSION_INDUSTRIES_LIST = "Danh sách các ngành đào tạo";
export const REQUIRED_CLASS = "Tổ hợp xét tuyển";
export const ADMISSION_TYPE_LIST = "Hình thức xét tuyển";
export const ADMISSION_MUST_KNOW = "Thông tin tuyển sinh";
export const SELECT_CATEGORIES = "Chọn danh mục";
export const ARTICLES_LIST = "Danh sách bài viết";
export const READ_MORE = "Đọc thêm bài viết khác";
export const READ_FULL = "Đọc toàn bộ bài viết";
export const ADMISSION_INFOMATION = "Thông tin tuyển sinh";
export const UNIVERSITY_DEGREE = "Trình độ đại học";
export const BOT_INSTRUCTION = `Để thông qua ${BOT_NAME} tra cứu thông tin tuyển sinh của Phân hiệu Đại học Thủy lợi, bạn thực hiện nhập \` / \` vào khung nội dung chat, chọn biểu tượng của ${BOT_NAME} và bắt đầu sử dụng.`;
export const TELEGRAM_INSTRUCTION = `Để thông qua ${BOT_NAME} tra cứu thông tin tuyển sinh của Phân hiệu Đại học Thủy lợi, bạn thực hiện nhập \` / \` vào khung nội dung chat hoặc bấm nút "Menu" bên trái khung chat và chọn chức năng muốn sử dụng`;
export const YOU_CAN_DIRECTLY_ASKING_FOR = `Bạn cũng có thể trực tiếp hỏi ${BOT_NAME}. Sau đây là ví dụ các câu hỏi bạn có thể thử:\n - Căn tin trường mình ở đâu?\n - Ngành công nghệ thông tin của trường mình thế nào?\n - Trường mình có những ngành nào?\n - Mã trường mình là gì?\n - Em có thể gửi xe ở đâu khi đến trường?\n - ...`;
export const OR_YOU_CAN_ASK_EVERYTHING_BY = `Hoặc bạn cũng có thể tán gẫu với ${BOT_NAME} bằng bất cứ vấn đề nào. Ví dụ: ${BOT_BUZZ_WORD}, Việt Nam có bao nhiêu tỉnh thành?; ${BOT_BUZZ_WORD}, làm sao để đậu đại học?; ${BOT_BUZZ_WORD}, ...`;
export const CAN_NOT_REPLY_YOUR_QUESTION = `${BOT_NAME} hiện chưa thể trả lời câu hỏi này`;
export const PLEASE_LET_ME_KNOW_WHAT_YOU_WANT_TO_SAY = `Vui lòng cho ${BOT_NAME} biết bạn muốn nói gì. Ví dụ: ${BOT_BUZZ_WORD}, anh muốn học thật giỏi,...`;
export const HELP_YOU_TO_SEARCH_ON_GOOGLE = `Tuy nhiên, ${BOT_NAME} đã giúp bạn tìm kiếm thông tin trên Google, hi vọng nó hữu ích`;
export const ADMISSION_INSTRUCTION = `Để xem thông tin tuyển sinh của Phân hiệu Đại học Thủy lợi bạn có thể sử dụng lệnh \` /admission \` của ${BOT_NAME} hoặc truy cập trang thông tin tuyển sinh: https://tlu.edu.vn/tuyen-sinh`;
export const REGISTER_INSTRUCTION = `Để đăng ký nhập học của Phân hiệu Đại học Thủy lợi bạn có thể sử dụng lệnh \` /register \` của ${BOT_NAME} hoặc truy cập trang đăng ký nhập học: https://nhaphoc.tlu.edu.vn`;
export const INDUSTRIES_INSTRUCTION = "Phân hiệu Đại học Thủy lợi hiện đang đào tạo nhóm ngành Thủy lợi, KTXD, CNTT, Kế toán, Logistic và một số ngành khác nhau đáp ứng nhu cầu người học. Sử dụng lệnh ` /admission ` và chọn mục ` Ngành đào tạo ` để xem chi tiết";
export const MESSAGE_TOO_LONG = `Tin nhắn quá dài, ${BOT_NAME} không thể hiểu được được. Bạn vui lòng thử lại với câu hỏi khác ngắn hơn`;
export const WELCOME_TO_REGISTER = `Chúc mừng sĩ tử đã trúng tuyển vào hệ Đại học chính quy của ${SCHOOL_NAME}`;
export const REGISTER_TIMEOUT = `Hiện đã hết thời gian đăng ký nhập học, vui lòng liên hệ <@${ADMIN_ID}> để được hỗ trợ!`;
export const NEW_STUDENT_REGISTER = "Đăng ký nhập học";
export const GO_REGISTER = "Tiến hành đăng ký nhập học";
export const REGISTER_DESCRIPTION = `Để đăng ký nhập học, bạn vui lòng bấm vào nút "Tiến hành đăng ký nhập học" bên dưới và thực hiện đầy đủ nội dung theo yêu cầu. Sau khi hoàn thành, bạn vui lòng chờ phản hồi từ phía ban quản lý để được xác nhận đăng ký nhập học thành công!`;
export const WELCOME_TO = `Chào mừng đến với`;
export const WHAT_ISSUE_ARE_YOU_INTERESTED_IN = "Bạn đang quan tâm về vấn đề nào?";
export const LEARN_MORE = "Tìm hiểu thêm";
export const ADD_REPLY_SUCCESSFULLY = "Thêm câu trả lời thành công!";
export const KEYWORD = "Từ khóa";
export const ANSWER = "Câu trả lời";
export const REMOVE_REPLY_SUCCESSFULLY = "Xóa câu trả lời thành công!";
export const REMOVE_ALL_REPLY_SUCCESSFULLY = "Xóa tất cả câu trả lời thành công!";
export const NAME = "Tên gợi nhớ";
export const WHEN_CREATE_KEYWORD_REPLY = "Khi tạo trả lời qua từ khóa";
export const REPLY_NOT_FOUND = "Không tìm thấy câu trả lời nào!";
export const SELECT_REPLY_TO_REMOVE = "Chọn câu trả lời để xóa";
export const REPLY_LIST = "Danh sách câu trả lời";
export const YES = "Có";
export const NO = "Không";
export const CANCEL = "Hủy";
export const REMOVE_REPLY = "Xóa câu trả lời";
export const REPLY_HAS_BEEN_REMOVED = "Câu trả lời đã được xóa!";
export const AUTO_CANCEL_IN = "Tự động hủy trong";
export const ARE_YOU_SURE_TO_REMOVE_THIS_KEYWORD_OR_THE_REPLY = "Bạn có chắc chắn muốn xóa từ khóa này hay câu trả lời?";
export const REMOVE_KEYWORD = "Xóa từ khóa";
export const KEYWORD_HAS_BEEN_REMOVED = "Từ khóa đã được xóa!";
export const TOO_LONG_STRING = "Chuỗi trả lời không được dài quá 2.000 ký tự!";
export const YOU_ARE_NOT_A_MODERATOR = "Bạn cần thuộc Ban Điều hành để sử dụng lệnh này";
export const DO_NOT_UNDESTAND = `${BOT_NAME} vẫn chưa hiểu ý của bạn, bạn có thể diễn đạt bằng cách khác được không? ^^`;
export const PLEASE_TRY_AGAIN_OR_CONTACT_CS = `Vui lòng thử lại hoặc liên hệ CSKH để được hỗ trợ!`;
export const PLEASE_WATCH_YOUR_LANGUAGE = `Hãy thử đổi cách diễn đạt của bạn để ${BOT_NAME} có thể hiểu rõ câu hơi của bạn hơn nhé!`;