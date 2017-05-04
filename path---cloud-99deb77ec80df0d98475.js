webpackJsonp([9],{"./.cache/json/cloud.json":function(e,n){e.exports={data:{site:{siteMetadata:{title:"POSM - Portable OpenStreetMap"}},markdownRemark:{id:"/Users/seth/src/posm/posm.github.io/src/pages/cloud/index.md absPath of file >>> MarkdownRemark",html:'<br />\n<br />\n<h1>Cloud Installation</h1>\n<br />\n<p>Interested in running POSM in the cloud? This type of setup is great for semi-connected instances when you want the integration of OpenMapKit/Field Papers/OSM but have more regular connectivity with your surveyors.</p>\n<p>First, this guide will walk through how to set things up in Amazon Web Services, specifically EC2. If you like another flavor or cloud services such as Azure, this process will still work but may look slightly different. This guide will also <em>not</em> show you how to get an AWS account, they already have great <a href="http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html">documentation</a>.</p>\n<br />\n<h2>Get a Fully Qualified Domain Name</h2>\n<p>Before installation, you should choose a domain name and host to use to access your new POSM and configure it with your DNS provider. If you don’t do this, you won’t be able to access the OpenStreetMap interface.</p>\n<p>Create the subdomain <code>osm.example.org</code> . You’ll configure the DNS later.</p>\n<h2>Instance Setup</h2>\n<p>The first thing you will need to do is start a new instance. In your AWS EC2 Dashboard click on Launch instance. Scroll all the way down and find Ubuntu 14.04 LTS. The posm-build process only works on Ubuntu 14.04 at this time.</p>\n<p><img src="/7b474c32f337e79cd0c2ad242c4f84f7.png"></p>\n<p>After selecting your instance type you’ll need to fill out a couple more things. Below are the recommended specs.</p>\n<p><img src="/f807c89081dbc72b408dd1fe4e3b70f6.png"></p>\n<p>Recomended specs for your intance are:</p>\n<ul>\n<li>Ubuntu 14.04 <strong><em>mandatory</em></strong></li>\n<li>\n<p>At least 2GB RAM, 8GB+ preferred</p>\n<ul>\n<li>If you use less than 8GB, you will not be able to run the OSM part of POSM. OpenMapKit Server runs happily on 2GB.</li>\n<li>If using SuperPOSM (OpenDroneMap), the more RAM the better</li>\n</ul>\n</li>\n<li>\n<p>At least 10GB of attached storage</p>\n<ul>\n<li>Not an issue unless you have lots of photos or will be processing OpenDroneMap images</li>\n</ul>\n</li>\n<li>\n<p>Open ports 22 and 80</p>\n<ul>\n<li>22 is needed to SSH into the server for administration and setup</li>\n<li>80 is needed to view the various resources</li>\n</ul>\n</li>\n<li>Our internal instance runs on a t3.medium with 8GB of RAM</li>\n</ul>\n<h2>Configure DNS</h2>\n<p>After the instance is created, also create an elastic IP and assign it to the instance you just created. AWS has a <a href="http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html#working-with-eips">great guide</a> for this.</p>\n<p>Now configure the DNS. Create an @ record and point it to the IP address that you just created and assigned to your instance.</p>\n<p>Sample DNS records:</p>\n<pre><code>my-posm.example.org     A     1.2.3.4\nosm.my-posm.example.org CNAME posm.example.org\n</code></pre>\n<h2>POSM Cloud Install</h2>\n<p>POSM Cloud uses posm-build to install because the live ubuntu instance for physical devices doesn’t work. The process take a little longer and requires a little bit of command line knowledge.</p>\n<p>To configure POSM on your cloud host, <a href="http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html">connect to it</a> using <code>ssh</code> and run the following commands.</p>\n<pre><code class="language-bash"><span class="token comment" spellcheck="true"># become root</span>\n<span class="token function">sudo</span> -i\n\n<span class="token comment" spellcheck="true"># update instance for security patches</span>\n<span class="token function">apt-get</span> <span class="token function">install</span> update <span class="token operator">&amp;&amp;</span> <span class="token function">apt-get</span> <span class="token function">install</span> upgrade\n\n<span class="token comment" spellcheck="true"># install git if necessary</span>\napt update <span class="token operator">&amp;&amp;</span> apt <span class="token function">install</span> --no-install-recommends -y <span class="token function">git</span>\n\n<span class="token comment" spellcheck="true"># clone this repository</span>\n<span class="token function">git</span> clone https://github.com/AmericanRedCross/posm-build\n\n<span class="token comment" spellcheck="true"># edit your settings (posm_hostname, posm_domain)</span>\n<span class="token function">vi</span> posm-build/kickstart/etc/settings</code></pre>\n<p>The important things to edit are <em>posm_hostname</em> and <em>posm_domain</em>. Set these equal to your hostname and domain that your purchased earlier. You can comfortably ignore all the wifi settings.</p>\n<p>If you are not comfortable with editing files via command line here is a quick guide to using <a href="https://www.cs.colostate.edu/helpdocs/vi.html">vi</a>. The important thing is to hit <code>i</code> to edit and then after making changes hit <code>ESC</code> and then <code>:</code> and type <code>wq</code> to “write and quit”</p>\n<p><img src="/dd95775da7835a0584e8f660a22b5f84.png"></p>\n<p>The last thing is to install everything. This will take a while; go get a snack and come back.</p>\n<pre><code>/root/posm-build/kickstart/scripts/bootstrap.sh base virt nodejs ruby gis mysql postgis nginx osm fieldpapers omk tl carto tessera admin\n</code></pre>\n<p>The above command will install everything needed to run POSM Cloud but <em>will not install</em> OpenDroneMap.</p>\n<p>To add SuperPOSM capabilities (OpenDroneMap + GeoTIFF processing), use the following instead.</p>\n<pre><code>/root/posm-build/kickstart/scripts/bootstrap.sh base virt nodejs ruby gis mysql postgis nginx osm fieldpapers omk tl carto tessera admin docker redis opendronemap imagery\n</code></pre>\n<h2>OMK Server Settings</h2>\n<p>OpenMapKit server does not apply authintification out of the box; you will need to set it up to ensure that sensitive information cannot be viewed on your cloud instance. This step requires more command line knowledge.</p>\n<p>If the POSM cloud install was succesful, then you should now be able edit your OMK server settings. You will need to uncomment the lines starting with “auth” and add in the credentials you would like.</p>\n<pre><code>sudo vi /opt/omk/OpenMapKitServer/settings.js\n</code></pre>\n<p>Your screen should looks something like this. <strong>Notice the added comma after the last <code>}</code> for osmApi</strong></p>\n<p><img src="/cd0cf9cff3d948469c2c15600063220a.jpg"></p>\n<p>After saving, just reboot your server and authentication should be working when you go to OMK Server.</p>\n<h2>Success</h2>\n<p>After everything is configured you can go to your domain and you should see the following screen.</p>\n<p><img src="/5f04c4a0f5a052f57617bed6739d074d.png"></p>',frontmatter:{title:"Cloud Installation",splash_image:null,splash_text:null}}},pathContext:{slug:"/cloud/"}}}});
//# sourceMappingURL=path---cloud-99deb77ec80df0d98475.js.map