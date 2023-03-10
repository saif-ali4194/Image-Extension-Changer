const input = document.getElementById("file");
input.addEventListener("change", () => {
	const file = input.files[0];
	const reader = new FileReader();
	reader.addEventListener("load", () => {
		const img = new Image();
		img.src = reader.result;

		img.addEventListener("load", () => {
			const imageURL = reader.result;
			document
				.getElementById("right")
				.style.setProperty("--selectedImg", `url(${imageURL})`);
			document.body.style.setProperty("--selectedImg", `url(${imageURL})`);
		});
	});
	reader.readAsDataURL(file);
});

document.getElementById("export").addEventListener("click", () => {
	try {
		const fileInput = document.getElementById("file");
		const extensionSelect = document.getElementById("extension-select");
		const file = fileInput.files[0];
		const selectedExtension = extensionSelect.value;
		const fileType = getSelectedExtension(selectedExtension);
		const reader = new FileReader();
		reader.onload = function () {
			const img = new Image();
			img.src = reader.result;

			img.onload = function () {
				const canvas = document.createElement("canvas");
				canvas.width = img.width;
				canvas.height = img.height;
				const ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0, img.width, img.height);

				canvas.toBlob(function (blob) {
					// get original file name & extension
					const originalFileName = file.name;
					const originalFileExtension = originalFileName.split(".").pop();
					const newFileName = originalFileName.replace(
						`.${originalFileExtension}`,
						selectedExtension
					);

					const newFile = new File([blob], newFileName, {
						type: fileType,
					});
					saveAs(newFile);
				}, fileType);
				fileInput.value = "";
			};
		};
		reader.readAsDataURL(file);
	} catch (e) {
		alert("Please select an image");
	}
});

// functions
function getSelectedExtension(selectedExtension) {
	switch (selectedExtension) {
		case ".jpg":
			return "image/jpeg";
		case ".png":
			return "image/png";
		case ".webp":
			return "image/webp";
	}
}
