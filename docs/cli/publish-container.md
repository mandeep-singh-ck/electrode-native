## `ern publish-container`

#### Description

* This command can be used to publish a local Container to a remote repository using a given publisher.

#### Syntax

`ern publish-container <containerPath>`  

**Arguments**

`<containerPath>`

* The local file system path to the directory containing the Container to publish.

**Options**  

`--containerPath`

* The local file system path to the directory containing the Container to publish.
* **Default**  If this option is not provided, the command will look for a Container in the default platform directory `~/.ern/containergen/out/[platform]`.

`--platform <android|ios>`

* Specify the native platform of the target Container to publish.
* This option is required, there is no default.

`--version/-v <version>`

* Specify the Container version to use for publication.
* The version must be in the format: `x.y.z` where x, y and z are integers. For example `version=1.2.30`.
* Defaults to `1.0.0`.

`--publisher/-p <publisher>`

* Specify the Container publisher to use.
* This option is required, there is no default.
* You can also use a local file system path to a Container publisher package (only used for developing custom publishers)

`--url/-u <url>`

* The url to publish the Container to 
* Some publishers might not need an url. Check the specific Container publisher documentation for reference

`--config/-c <config>`

* Extra configuration specific to the publisher used.
* Some publishers might not need an extra configuration. Check the Container publisher documentation for reference.
* The configuration is a json document.
* Configuration can either be a json string or the path to a file holding the configuration.

#### Related commands

[ern create-container] | Create a new container (native or JavaScript only) locally to the workstation.

[ern create-container]: ./create-container.md
