const { exec } = require('child_process');
const fs = require('fs')
const glob = require('glob')


const SRC = 'app/src';



const getFileData = file => new Promise((resolve, reject) => {
	fs.readFile(file, 'utf8', (err, data) => {
		const meta = data.match(/<!---([^]*)-->/);
		if (meta && meta.length) {
			const metaObj = JSON.parse(meta[1]);
			if (metaObj.next) metaObj.next = SRC + '/' + metaObj.next;
			resolve(Object.assign({}, {file}, metaObj))
		}
		else {
			resolve(null)
		}
	})
});
const reloadSummary = () => glob(SRC + '/**/*', (err, res) => {
	if (err) {
		console.log('ERR: ', err)
		return;
	}

	let a = [];
	const files = Promise.all(res.map(file => getFileData(file)));
	files
		.then(allFiles => allFiles.filter(f => f !== null))
		.then(usableFiles => {
			while (usableFiles.length > 0) {
				if (a.length === 0) {
					a = a.concat([usableFiles[0]]);
					usableFiles = usableFiles.slice(1)
					continue;
				}

				if (usableFiles[0].first) {
					a = [usableFiles[0]].concat(a);
					usableFiles = usableFiles.slice(1)
					continue;
				}

				let isBroke = false
				for (let k = 0; k < a.length; ++k) {
					const isUseableFileNext = usableFiles[0].file === a[k].next
					const isUseableFilePrev = a[k].file === usableFiles[0].next
					if (isUseableFileNext) {
						// found, push
						a = a.slice(0,k+1).concat([usableFiles[0]]).concat(a.slice(k+1));
						usableFiles = usableFiles.slice(1)
						isBroke = true;
						break;
					}
					if (isUseableFilePrev) {
						a = a.slice(0,k-1).concat([usableFiles[0]]).concat(a.slice(k-1));
						usableFiles = usableFiles.slice(1)
						isBroke = true;
						break;
					}
				}
				if (isBroke) continue;
				usableFiles.push(usableFiles.shift())
			}

			return a;
		})
		.then(files => {
			const md = files.map(({title, file}) => `- [${title}](${file.split('/').pop()})`)
			fs.writeFile(SRC + '/SUMMARY.md', `# Summary 

${md.join('\n')}`, (err) => {
				reBuild();
			});
		})

})



const reBuild = () => {
	exec('make build', (err, stdout, stderr) => {
	  if (err) {
	    // node couldn't execute the command
	    return;
	  }

	  // the *entire* stdout and stderr (buffered)
	  console.log(`stdout: ${stdout}`);
	  console.log(`stderr: ${stderr}`);
	})
}

module.exports = {SRC, reBuild, reloadSummary}