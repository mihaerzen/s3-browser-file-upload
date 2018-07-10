/* eslint-disable no-underscore-dangle */

(function () {
  function AjaxFileUploader() {
    this.submitFormData = function (uploadUrl, formData) {
      const xhr = new XMLHttpRequest();
      xhr.onprogress = function (e) {
        console.debug('onprogress', e);
      };

      xhr.onload = function (e) {
        console.debug('onload', e);
      };

      xhr.onerror = function (e) {
        console.error('onerror', e);
      };

      xhr.open('POST', uploadUrl, true);

      // xhr.setRequestHeader('Content-Type', 'multipart/form-data');

      xhr.send(formData);
    };
  }

  const ajaxFileUploader = new AjaxFileUploader();

  const form = document.getElementById('form');
  const fileInput = document.getElementById('fileInput');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const file = fileInput.files[0];
    const fileName = file.name;

    fetch(`/sign?fileName=${fileName}`)
      .then(response => response.json())
      .then((response) => {
        console.log(response);
        const formData = new FormData();
        formData.append('key', response.key);
        formData.append('acl', response.acl);
        formData.append('Content-Type', response.contentType);
        formData.append('x-amz-server-side-encryption', response.xAmzServerSideEncryption);
        formData.append('X-Amz-Credential', response.xAmzCredential);
        formData.append('X-Amz-Algorithm', response.xAmzAlgorithm);
        formData.append('Policy', response.policy);
        formData.append('X-Amz-Date', response.xAmzDate);
        formData.append('X-Amz-Signature', response.signature);

        // formData.append('AWSAccessKeyId', window.awsKey);
        // formData.append('success_action_status', '201');
        formData.append('file', file);

        console.log('uploading...');
        ajaxFileUploader.submitFormData('https://voucher-manager-alpha.s3-eu-central-1.amazonaws.com', formData);
      })
      .catch((err) => {
        console.error(err);
      });

    // $.ajax({
    //   url: "/signed",
    //   type: 'GET',
    //   dataType: 'json',
    //   data: {title: data.files[0].name}, // Send filename to /signed for the signed response
    //   async: false,
    //   success: function(data) {
    //     // Now that we have our data, we update the form so it contains all
    //     // the needed data to sign the request
    //     form.find('input[name=key]').val(data.key);
    //     form.find('input[name=policy]').val(data.policy);
    //     form.find('input[name=signature]').val(data.signature);
    //     form.find('input[name=Content-Type]').val(data.contentType);
    //   }
    // })
  });
}());
