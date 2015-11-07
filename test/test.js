var TfIdf = require('../');
var tfidf = new TfIdf();

tfidf.addDocument('Trường Đại học Công nghệ Thông tin, Đại học Quốc gia Thành phố Hồ Chí Minh (ĐHQG-HCM) là trường đại học công lập đào tạo về công nghệ thông tin và truyền thông (CNTT&TT)');
tfidf.addDocument('được thành lập theo quyết định số 134/2006/QĐ-TTg ngày 08/06/2006 của Thủ tướng Chính phủ trên cơ sở Trung tâm Phát triển Công nghệ Thông tin');
tfidf.addDocument('Là trường thành viên của ĐHQG-HCM, trường ĐH CNTT có nhiệm vụ đào tạo nguồn nhân lực công nghệ thông tin góp phần tích cực vào sự phát triển của nền công nghiệp công nghệ thông tin Việt Nam');
tfidf.addDocument('Là trường thành viên của ĐHQG-HCM, trường ĐH CNTT có nhiệm vụ đào tạo nguồn nhân lực công nghệ thông tin góp phần tích cực vào sự phát triển của nền công nghiệp công nghệ thông tin Việt Nam');
tfidf.addDocument('UIT có đội ngũ cán bộ, giảng viên với trình độ chuyên môn cao, đáp ứng được yêu cầu đào tạo và nghiên cứu khoa học theo định hướng đại học nghiên cứu');

console.log("Thông tin =====================");
tfidf.tfidfs('Thông tin', function(i, measure) {
    console.log('document #' + i + ' is ' + measure);
});

console.log("ĐHQG-HCM =====================");
tfidf.tfidfs('ĐHQG-HCM', function(i, measure) {
    console.log('document #' + i + ' is ' + measure);
});

console.log("\n\n-------- applied to individual documents ---------");
console.log("ĐHQG-HCM in document 0: ", tfidf.tfidf('ĐHQG-HCM', 0));
console.log("ĐHQG-HCM in document 1: ", tfidf.tfidf('ĐHQG-HCM', 1));