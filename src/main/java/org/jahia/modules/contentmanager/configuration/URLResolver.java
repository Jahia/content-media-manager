package org.jahia.modules.contentmanager.configuration;

import net.sf.ehcache.Ehcache;
import org.jahia.services.content.JCRNodeWrapper;
import org.jahia.services.content.JCRSessionFactory;
import org.jahia.services.render.RenderContext;
import org.jahia.services.render.Resource;

import javax.jcr.RepositoryException;
import javax.servlet.http.HttpServletRequest;
import java.util.Locale;

public class URLResolver extends org.jahia.services.render.URLResolver {

    public URLResolver(String urlPathInfo, String serverName, HttpServletRequest request, Ehcache nodePathCache, Ehcache siteInfoCache) {
        super(urlPathInfo, serverName, request, nodePathCache, siteInfoCache);
    }

    public URLResolver(String pathInfo, String serverName, String workspace, HttpServletRequest request, Ehcache nodePathCache, Ehcache siteInfoCache) {
        super(pathInfo, serverName, workspace, request, nodePathCache, siteInfoCache);
    }

    public URLResolver(String url, RenderContext context, Ehcache nodePathCache, Ehcache siteInfoCache) {
        super(url, context, nodePathCache, siteInfoCache);
    }

    @Override
    public JCRNodeWrapper resolveNode(String workspace, Locale locale, String path) throws RepositoryException {
        return JCRSessionFactory.getInstance().getCurrentUserSession(workspace,locale).getNode(path);
    }

    @Override
    protected Resource resolveResource(String workspace, Locale locale, String path) throws RepositoryException {
        return new Resource(resolveNode(workspace, locale, path), "html", "default", Resource.CONFIGURATION_PAGE);
    }
}
