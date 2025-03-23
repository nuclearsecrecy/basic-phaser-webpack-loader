/** 
 * Copies directories or individual files to dist folder. This is used
 * by `prod.js` for creating the distributable version of the game.
 */
const path = require("path");
const fs = require("fs");

module.exports = function (config) {
	if (!config) {
		console.log(`copyFiles.js ERROR: no config object!`);
		return false;
	}
	if (!config.output) {
		console.log(`copyFiles.js ERROR: no "output" property in config object!`);
		return false;
	}

	var base = "";

	var output_dir = path.join(base, config.output);

	if (!fs.existsSync(output_dir)) {
		console.log(`copyFiles.js ERROR: output directory does not exist! ${output_dir}`);
		return false;
	}

	if (config.files) {
		for (var i in config.files) {
			if (!fs.existsSync(path.join(base, config.files[i]))) {
				console.log(`copyFiles.js ERROR: could not copy file as it does not exist! ${path.join(base, config.files[i])}`);
			} else {
				try {
					fs.copyFileSync(path.join(base, config.files[i]), path.join(output_dir, path.basename(config.files[i])));
				} catch (err) {
					console.log(`copyFiles.js ERROR: file did not copy! from: ${path.join(base, config.files[i])} to: ${path.join(output_dir, path.basename(config.files[i]))} error: ${err}`);
				}
			}
		}
	}
	if (config.public) {
		if (!fs.existsSync(path.join(base, config.public))) {
			console.log(`copyFiles.js ERROR: could not copy public directory as it does not exist! ${path.join(base, config.public)}`);
		} else {
			var contents = fs.readdirSync(path.join(base, config.public));
			for (var i in contents) {
				var exclude = false;
				if (contents[i].substr(0, 1) == ".") exclude = true;
				if (config.exclude_ext && config.exclude_ext.includes(path.extname(contents[i]).substr(1))) exclude = true;
				if (config.exclude && config.exclude.includes(contents[i])) exclude = true;
				if (!exclude) {
					var p = path.join(base, config.public, contents[i]);
					if (fs.lstatSync(p).isDirectory()) {
						try {
							fs.cpSync(p, path.join(output_dir, path.basename(p)), {
								recursive: true,
								filter: (src, dest) => {
									var file = path.basename(src);
									if (config.exclude && config.exclude.includes(file)) return false;
									if (config.exclude_ext && config.exclude_ext.includes(path.extname(file).substr(1))) return false;
									if (file.substr(0, 1) == ".") return false;
									if (config.substitute && config.substitute[file]) {
										fs.writeFileSync(dest, config.substitute[file]);
										return false;
									}
									return true;
								},
							});
						} catch (err) {
							console.log(`copyFiles.js ERROR: failed to copy directory in public! from: ${p} to: ${path.join(output_dir, path.basename(p))} error: ${err}`);
						}
					} else {
						try {
							fs.copyFileSync(p, path.join(output_dir, path.basename(p)));
						} catch (err) {
							console.log(`copyFiles.js ERROR: file in public did not copy! from: ${p} to: ${path.join(output_dir, path.basename(p))} error: ${err}`);
						}
					}
				}
			}
			console.log(`copyFiles.js done copying`);
		}
	}
};
