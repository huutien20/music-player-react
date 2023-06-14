# Mô tả các chức năng của ứng dụng

## Lấy danh sách bài hát từ API

API: https://api-zingmp3-vercel.vercel.app/api/charthome
Ứng dụng sẽ sử dụng API để lấy danh sách các bài hát và thông tin liên quan tới bài hát như: tên bài hát, tên ca sĩ, đường dẫn bài hát, thumbnail,...

## Tìm kiếm

Người dùng có thể tìm kiếm bài hát, ca sĩ bằng cách nhập từ khóa vào ô tìm kiếm. Kết quả tìm kiếm sẽ được hiển thị cho người dùng để họ chọn bài hát nghe.

## Thêm bài hát vào danh sách yêu thích

Khi người dùng nghe một bài hát mà họ muốn lưu trữ vào danh sách yêu thích, họ có thể nhấp vào biểu tượng "Trái tim". Bài hát sẽ được lưu trữ vào localStorage và người dùng có thể truy cập vào danh sách yêu thích để xem và phát lại bài hát bất kỳ khi muốn.

## Tải xuống
Người dùng có thể chọn tải xuống bài hát để lưu trữ và nghe offline. Khi người dùng nhấp vào nút tải xuống, ứng dụng sẽ tải xuống bài hát và lưu trữ nó trong thiết bị của người dùng.

## Hiển thị bài hát đang chạy:
Khi người dùng chọn một bài hát để phát, ứng dụng sẽ hiển thị thông tin về bài hát đang chạy, bao gồm tên bài hát, ca sĩ và hình ảnh liên quan. Ngoài ra, ứng dụng cũng có thể hiển thị thanh tiến độ phát và các nút điều khiển như phát/tạm dừng, chuyển bài, phát ngẫu nhiên, lặp lại,...
