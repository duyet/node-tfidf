# node-tfidf
Calc TF-IDF string for Nodejs 

Term Frequency–Inverse Document Frequency (tf-idf) is implemented to determine how important a word (or words) is to a document relative to a corpus. The following example will add four documents to a corpus and determine the weight of the word "node" and then the weight of the word "ruby" in each document.

# Install
```bash
npm install node-tfidf
```

#Example 

```js
var TfIdf = require('node-tfidf');
var tfidf = new TfIdf();

tfidf.addDocument('Trường Đại học Công nghệ Thông tin, Đại học Quốc gia Thành phố Hồ Chí Minh (ĐHQG-HCM) là trường đại học công lập đào tạo về công nghệ thông tin và truyền thông (CNTT&TT)');
tfidf.addDocument('được thành lập theo quyết định số 134/2006/QĐ-TTg ngày 08/06/2006 của Thủ tướng Chính phủ trên cơ sở Trung tâm Phát triển Công nghệ Thông tin');
tfidf.addDocument('Là trường thành viên của ĐHQG-HCM, trường ĐH CNTT có nhiệm vụ đào tạo nguồn nhân lực công nghệ thông tin góp phần tích cực vào sự phát triển của nền công nghiệp công nghệ thông tin Việt Nam');
tfidf.addDocument('Là trường thành viên của ĐHQG-HCM, trường ĐH CNTT có nhiệm vụ đào tạo nguồn nhân lực công nghệ thông tin góp phần tích cực vào sự phát triển của nền công nghiệp công nghệ thông tin Việt Nam');
tfidf.addDocument('UIT có đội ngũ cán bộ, giảng viên với trình độ chuyên môn cao, đáp ứng được yêu cầu đào tạo và nghiên cứu khoa học theo định hướng đại học nghiên cứu');

console.log("UIT =====================");
tfidf.tfidfs('UIT', function(i, measure) {
    console.log('document #' + i + ' is ' + measure);
});

console.log("ĐHQG-HCM =====================");
tfidf.tfidfs('ĐHQG-HCM', function(i, measure) {
    console.log('document #' + i + ' is ' + measure);
});
```

The above outputs:
```
UIT =====================
document #0 is 0
document #1 is 0
document #2 is 0
document #3 is 0
document #4 is 1.91629073187415
ĐHQG-HCM =====================
document #0 is 2.4462871026284194
document #1 is 0
document #2 is 2.4462871026284194
document #3 is 2.4462871026284194
document #4 is 0
```

### applied to individual documents
The following example measures the term "node" in the first and second documents.
```js
console.log(tfidf.tfidf('ĐHQG-HCM', 0));
console.log(tfidf.tfidf('ĐHQG-HCM', 1));
```

### load documents from files on disk.
```js
tfidf.addFileSync('data_files/one.txt');
tfidf.addFileSync('data_files/two.txt');
```

### Multiple terms
Multiple terms can be measured as well, with their weights being added into a single measure value. 

```js
console.log("Thông tin =====================");
tfidf.tfidfs('Thông tin', function(i, measure) {
    console.log('document #' + i + ' is ' + measure);
});
```

The above outputs:	
```
Thông tin =====================
document #0 is 5
document #1 is 2
document #2 is 4
document #3 is 4
document #4 is 0
```

### perform your own tokenization
The examples above all use strings, which case to automatically tokenize the input. 
If you wish to perform your own tokenization or other kinds of processing, you can do so, then pass in the resultant arrays later. 

```js
var TfIdf = require('node-tfidf');
var tfidf = new TfIdf();

tfidf.addDocument(['document', 'about', 'node']);
tfidf.addDocument(['document', 'about', 'ruby']);
tfidf.addDocument(['document', 'about', 'ruby', 'node']);
tfidf.addDocument(['document', 'about', 'node', 'node', 'examples']);

tfidf.tfidfs(['node', 'ruby'], function(i, measure) {
    console.log('document #' + i + ' is ' + measure);
});
```

# How to contribute
1. Fork the project on Github
2. Create a topic branch for your changes
3. Ensure that you provide documentation and test coverage for your changes (patches won’t be accepted without)
4. Create a pull request on Github (these are also a great place to start a conversation around a patch as early as possible)

# License
MIT License

Copyright (c) 2015 Van-Duyet Le

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.