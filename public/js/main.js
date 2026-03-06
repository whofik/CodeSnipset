(function() {
  'use strict';

  var toastTimeout = null;

  function showToast(message, isError) {
    var existingToast = document.getElementById('toast');
    if (existingToast) {
      existingToast.remove();
    }

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    var toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast ' + (isError ? 'toast-error' : 'toast-success');

    var icon = document.createElement('i');
    icon.className = isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';

    var text = document.createElement('span');
    text.textContent = message;

    toast.appendChild(icon);
    toast.appendChild(text);
    document.body.appendChild(toast);

    requestAnimationFrame(function() {
      toast.classList.add('show');
    });

    toastTimeout = setTimeout(function() {
      toast.classList.remove('show');
      setTimeout(function() {
        if (toast && toast.parentNode) {
          toast.remove();
        }
      }, 300);
    }, 3000);
  }

  window.showToast = showToast;

  function initCopyCode() {
    var copyBtn = document.getElementById('copyBtn');
    var codeContent = document.getElementById('codeContent');

    if (copyBtn && codeContent) {
      copyBtn.addEventListener('click', function() {
        var codeText = codeContent.value;
        var originalHTML = copyBtn.innerHTML;

        copyBtn.disabled = true;
        copyBtn.innerHTML = '<i class="fas fa-spinner spinner"></i>';

        navigator.clipboard.writeText(codeText).then(function() {
          copyBtn.innerHTML = '<i class="fas fa-check"></i><span style="margin-left:6px;">Copied!</span>';
          showToast('Code copied!');

          setTimeout(function() {
            copyBtn.innerHTML = originalHTML;
            copyBtn.disabled = false;
          }, 2000);
        }).catch(function() {
          showToast('Failed to copy', true);
          copyBtn.innerHTML = originalHTML;
          copyBtn.disabled = false;
        });
      });
    }
  }

  function handleAddSnippet(e) {
    e.preventDefault();
    var form = e.target;
    var submitBtn = form.querySelector('button[type="submit"]');
    var originalBtnText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner spinner"></i> Creating...';

    var filename = document.getElementById('filename').value.trim();
    var description = document.getElementById('description').value.trim();
    var code = document.getElementById('code').value;
    var secretKey = document.getElementById('secret_key').value;

    fetch('/api/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'secret_key': secretKey
      },
      body: JSON.stringify({
        filename: filename,
        description: description,
        code: code
      })
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(result) {
      if (result.success) {
        showToast('Snippet created!');
        setTimeout(function() {
          window.location.href = '/';
        }, 1500);
      } else {
        showToast(result.message || 'Failed', true);
      }
    })
    .catch(function(error) {
      showToast(error.message, true);
    })
    .finally(function() {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    });
  }

  function handleEditSnippet(e) {
    e.preventDefault();
    var form = e.target;
    var submitBtn = form.querySelector('button[type="submit"]');
    var originalBtnText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner spinner"></i> Saving...';

    var gistId = document.getElementById('edit_gistId').value;
    var filename = document.getElementById('edit_filename').value;
    var description = document.getElementById('edit_description').value.trim();
    var code = document.getElementById('edit_code').value;
    var secretKey = document.getElementById('edit_secret_key').value;

    fetch('/api/edit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'secret_key': secretKey
      },
      body: JSON.stringify({
        gistId: gistId,
        filename: filename,
        description: description,
        code: code
      })
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(result) {
      if (result.success) {
        showToast('Snippet updated!');
        setTimeout(function() {
          window.location.href = '/files/' + encodeURIComponent(filename);
        }, 1500);
      } else {
        showToast(result.message || 'Failed', true);
      }
    })
    .catch(function(error) {
      showToast(error.message, true);
    })
    .finally(function() {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    });
  }

  function init() {
    initCopyCode();

    var addForm = document.getElementById('addSnippetForm');
    if (addForm) {
      addForm.addEventListener('submit', handleAddSnippet);
    }

    var editForm = document.getElementById('editSnippetForm');
    if (editForm && !editForm.hasAttribute('data-initialized')) {
      editForm.addEventListener('submit', handleEditSnippet);
      editForm.setAttribute('data-initialized', 'true');
    }

    setTimeout(function() {
      if (window.Prism) {
        Prism.highlightAll();
      }
    }, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
