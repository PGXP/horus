/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pgxp.horus;

import org.demoiselle.jee.configuration.annotation.Configuration;

/**
 *
 * @author PauloGladson
 */
@Configuration(prefix = "demoiselle.horus")
public class HorusConfig {

    private String path;

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

}
