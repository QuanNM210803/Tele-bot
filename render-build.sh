
set -o errexit
npm install

PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer

mkdir -p $PUPPETEER_CACHE_DIR

npx puppeteer browsers install chrome

if [[ ! -d $PUPPETEER_CACHE_DIR ]]; then
  echo "...Đang sao chép Puppeteer Cache từ Build Cache"
  cp -R /opt/render/project/src/.cache/puppeteer/chrome/ $PUPPETEER_CACHE_DIR
else
  echo "...Lưu trữ Puppeteer Cache trong Build Cache"
  cp -R $PUPPETEER_CACHE_DIR /opt/render/project/src/.cache/puppeteer/chrome/
fi


# set -o errexit

# npm install

# export PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer

# mkdir -p /opt/render/project/src/.cache/puppeteer/chrome/
# mkdir -p $PUPPETEER_CACHE_DIR

# npx puppeteer browsers install chrome

# if [[ -d $PUPPETEER_CACHE_DIR ]]; then
#   echo "...Lưu trữ Puppeteer Cache trong Build Cache"
#   cp -R $PUPPETEER_CACHE_DIR/* /opt/render/project/src/.cache/puppeteer/chrome/
# else
#   echo "...Không tìm thấy Puppeteer Cache, bỏ qua bước sao chép"
# fi
