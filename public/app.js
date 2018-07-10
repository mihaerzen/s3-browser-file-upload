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
        formData.append('file', file);

        console.log('uploading...');
        ajaxFileUploader.submitFormData(`https://${window.AWS_BUCKET}.s3-${window.AWS_REGION}.amazonaws.com`, formData);
      })
      .catch((err) => {
        console.error(err);
      });
  });
}());
