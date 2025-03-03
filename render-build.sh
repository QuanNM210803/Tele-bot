
# set -o errexit
# npm install

# PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer

# mkdir -p $PUPPETEER_CACHE_DIR

# npx puppeteer browsers install chrome

# if [[ ! -d $PUPPETEER_CACHE_DIR ]]; then
#   echo "...Đang sao chép Puppeteer Cache từ Build Cache"
#   cp -R /opt/render/project/src/.cache/puppeteer/chrome/ $PUPPETEER_CACHE_DIR
# else
#   echo "...Lưu trữ Puppeteer Cache trong Build Cache"
#   cp -R $PUPPETEER_CACHE_DIR /opt/render/project/src/.cache/puppeteer/chrome/
# fi

#!/bin/bash
set -o errexit

# Cài đặt dependencies
npm install

# Định nghĩa biến chứa đường dẫn Puppeteer Cache
export PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer

# Tạo thư mục nếu chưa tồn tại
mkdir -p $PUPPETEER_CACHE_DIR

# Cài đặt Chrome cho Puppeteer
npx puppeteer browsers install chrome

# Kiểm tra nếu thư mục Puppeteer Cache tồn tại
if [[ -d $PUPPETEER_CACHE_DIR ]]; then
  echo "...Lưu trữ Puppeteer Cache trong Build Cache"
  cp -R $PUPPETEER_CACHE_DIR /opt/render/project/src/.cache/puppeteer/chrome/
else
  echo "...Không tìm thấy Puppeteer Cache, tạo mới"
  mkdir -p /opt/render/project/src/.cache/puppeteer/chrome/
fi
